import { getDatabase } from '../database/db';
import { Citizen, DailyQuest, ExerciseLog, ReadingLog, ExamenVesperi } from '../types';

export class PaideiaRepository {
  // --- CITIZEN ---
  static async getCitizen(): Promise<Citizen> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Citizen>('SELECT * FROM citizen LIMIT 1');
    if (!row) throw new Error('Citizen not found');
    return row;
  }

  static async addVirtus(points: number, pillar: 'robur' | 'sapientia'): Promise<void> {
    const db = await getDatabase();
    if (pillar === 'robur') {
      await db.runAsync(
        'UPDATE citizen SET virtus_score = virtus_score + ?, robur_score = robur_score + ? WHERE id = 1',
        [points, points]
      );
    } else {
      await db.runAsync(
        'UPDATE citizen SET virtus_score = virtus_score + ?, sapientia_score = sapientia_score + ? WHERE id = 1',
        [points, points]
      );
    }
  }

  // --- GYMNASIUM LOGS ---
  static async logExercise(
    exercise_type: 'PUSHUPS' | 'SQUATS' | 'ABS' | 'RUN',
    reps_or_distance: number,
    duration_s: number,
    ai_verified: boolean
  ): Promise<void> {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];
    await db.runAsync(
      `INSERT INTO gymnasium_logs (date, exercise_type, reps_or_distance_m, duration_seconds, ai_verified)
       VALUES (?, ?, ?, ?, ?)`,
      [today, exercise_type, reps_or_distance, duration_s, ai_verified ? 1 : 0]
    );
    await this.addVirtus(Math.max(1, Math.floor(reps_or_distance / 10)), 'robur');
  }

  // --- READING / TRIVIUM ---
  static async logReading(
    book_title: string,
    author: string,
    pages_read: number,
    minutes_focused: number
  ): Promise<void> {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];
    await db.runAsync(
      `INSERT INTO reading_logs (book_title, author, pages_read, minutes_focused, date)
       VALUES (?, ?, ?, ?, ?)`,
      [book_title, author, pages_read, minutes_focused, today]
    );
    await this.addVirtus(Math.max(2, Math.floor(pages_read / 5)), 'sapientia');
  }

  // --- EXAMEN VESPERI ---
  static async saveExamenVesperi(
    quid_recte: string,
    quid_hesitavi: string,
    quid_debeo: string
  ): Promise<void> {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];
    await db.runAsync(
      `INSERT OR REPLACE INTO examen_vesperi (date, quid_recte, quid_hesitavi, quid_debeo, penalty_imposed)
       VALUES (?, ?, ?, ?, 0)`,
      [today, quid_recte, quid_hesitavi, quid_debeo]
    );
    await this.addVirtus(5, 'sapientia');
  }
}
