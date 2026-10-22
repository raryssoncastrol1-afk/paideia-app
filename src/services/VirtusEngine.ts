import { getDatabase } from '../database/db';
import { CursusHonorumEngine } from './CursusHonorumEngine';
import { Citizen } from '../types';

export interface ExpiatioPenalty {
  has_penalty: boolean;
  reason?: string;
  remedy_title?: string;
  remedy_description?: string;
  required_reps_extra?: number;
  required_pages_extra?: number;
}

export class VirtusEngine {
  /**
   * Checagem diária de abertura:
   * Verifica se o dia anterior teve os deveres cumpridos e atualiza o streak de constância
   */
  static async processDailyCycle(): Promise<{ citizen: Citizen; penalty: ExpiatioPenalty }> {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];

    const citizen = await db.getFirstAsync<Citizen>('SELECT * FROM citizen LIMIT 1');
    if (!citizen) throw new Error('Citizen not found');

    // Busca o exame de ontem para verificar se houve omissão
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const examenOntem = await db.getFirstAsync<{ id: number; quid_recte: string }>(
      'SELECT id, quid_recte FROM examen_vesperi WHERE date = ?',
      [yesterdayDate]
    );

    let penalty: ExpiatioPenalty = { has_penalty: false };

    // Se o usuário não preencheu o exame ou não fez os deveres de ontem
    if (!examenOntem && citizen.constantia_streak > 1) {
      penalty = {
        has_penalty: true,
        reason: 'A negligência quebrou a vigília noturna (Examen Vesperi não realizado).',
        remedy_title: 'Expiatio Estóica: Penitência do Caráter',
        remedy_description: 'Para restaurar a honra, realize o dobro de reflexão e 30 repetições de calistenia.',
        required_reps_extra: 30,
        required_pages_extra: 10
      };
      // Streak zera ou recua perante omissão
      await db.runAsync('UPDATE citizen SET constantia_streak = 1 WHERE id = 1');
    }

    // Avalia promoção no Cursus Honorum
    const currentReq = CursusHonorumEngine.evaluateRank(
      citizen.virtus_score,
      citizen.robur_score,
      citizen.sapientia_score,
      citizen.constantia_streak
    );

    if (currentReq.rank !== citizen.rank) {
      await db.runAsync('UPDATE citizen SET rank = ? WHERE id = 1', [currentReq.rank]);
      citizen.rank = currentReq.rank;
    }

    return { citizen, penalty };
  }

  /**
   * Gera as obrigações diárias de Paideia para a data de hoje (caso não existam)
   */
  static async ensureDailyQuests(): Promise<void> {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];

    const quests = await db.getAllAsync('SELECT * FROM daily_quests WHERE date = ?', [today]);
    if (quests.length === 0) {
      // 1. Gymnasium (Soma)
      await db.runAsync(
        `INSERT INTO daily_quests (date, pillar, title, target_reps_or_min, current_progress, completed)
         VALUES (?, 'GYMNASIUM', 'Gymnasium: 50 Repetições de Calistenia (Flexões/Agachamentos)', 50, 0, 0)`,
        [today]
      );
      // 2. Trivium (Lectio & Intellectus)
      await db.runAsync(
        `INSERT INTO daily_quests (date, pillar, title, target_reps_or_min, current_progress, completed)
         VALUES (?, 'TRIVIUM', 'Lectio: 15 Páginas de Clássicos ou 20m de Estudo Focado', 15, 0, 0)`,
        [today]
      );
      // 3. Stoa (Examen Vesperi)
      await db.runAsync(
        `INSERT INTO daily_quests (date, pillar, title, target_reps_or_min, current_progress, completed)
         VALUES (?, 'EXAMEN', 'Examen Vesperi: O Triplo Julgamento Noturno da Consciência', 1, 0, 0)`,
        [today]
      );
    }
  }
}
