export type CursusRank = 'TIRO' | 'LEGIONARIUS' | 'CENTURIO' | 'TRIBUNUS' | 'PHILOSOPHUS';

export interface Citizen {
  id: number;
  name: string;
  rank: CursusRank;
  virtus_score: number;       // Pontuação de honra e virtude
  robur_score: number;        // Força física (Gymnasium)
  sapientia_score: number;    // Conhecimento & Trivium
  constantia_streak: number;  // Dias seguidos de cumprimento
  created_at: string;
}

export type ExerciseType = 'PUSHUPS' | 'SQUATS' | 'ABS' | 'RUN';

export interface DailyQuest {
  id: number;
  date: string;               // YYYY-MM-DD
  pillar: 'GYMNASIUM' | 'TRIVIUM' | 'EXAMEN';
  title: string;
  target_reps_or_min: number;
  current_progress: number;
  completed: boolean;
}

export interface ExerciseLog {
  id: number;
  date: string;
  exercise_type: ExerciseType;
  reps_or_distance_m: number;
  duration_seconds: number;
  ai_verified: boolean;       // Contado via MediaPipe Pose ou manual
  created_at: string;
}

export interface ReadingLog {
  id: number;
  book_title: string;
  author: string;
  pages_read: number;
  minutes_focused: number;
  date: string;
  created_at: string;
}

export interface ExamenVesperi {
  id: number;
  date: string;
  quid_recte: string;         // O que fiz de correto hoje?
  quid_hesitavi: string;      // Onde hesitei ou falhei?
  quid_debeo: string;         // O que ainda devo cumprir?
  penalty_imposed: boolean;
  created_at: string;
}
