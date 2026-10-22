import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync('paideia.db');
  await initSchema(dbInstance);
  return dbInstance;
}

async function initSchema(db: SQLite.SQLiteDatabase) {
  // Executa pragmas e criação das tabelas essenciais
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Tabela do Cidadão (Perfil Único Local)
    CREATE TABLE IF NOT EXISTS citizen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rank TEXT NOT NULL DEFAULT 'TIRO',
      virtus_score INTEGER NOT NULL DEFAULT 0,
      robur_score INTEGER NOT NULL DEFAULT 0,
      sapientia_score INTEGER NOT NULL DEFAULT 0,
      constantia_streak INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- Quests do Dia (Gymnasium + Trivium + Examen)
    CREATE TABLE IF NOT EXISTS daily_quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      pillar TEXT NOT NULL,
      title TEXT NOT NULL,
      target_reps_or_min INTEGER NOT NULL,
      current_progress INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0
    );

    -- Logs do Gymnasium (Câmera MediaPipe / GPS)
    CREATE TABLE IF NOT EXISTS gymnasium_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      exercise_type TEXT NOT NULL,
      reps_or_distance_m INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL,
      ai_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- Logs do Trivium & Leitura
    CREATE TABLE IF NOT EXISTS reading_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_title TEXT NOT NULL,
      author TEXT NOT NULL,
      pages_read INTEGER NOT NULL,
      minutes_focused INTEGER NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- Exame Noturno Estóico
    CREATE TABLE IF NOT EXISTS examen_vesperi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      quid_recte TEXT,
      quid_hesitavi TEXT,
      quid_debeo TEXT,
      penalty_imposed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Inicializa o cidadão padrão caso ainda não exista
  const first = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM citizen');
  if (!first || first.count === 0) {
    await db.runAsync(
      `INSERT INTO citizen (name, rank, virtus_score, robur_score, sapientia_score, constantia_streak) 
       VALUES ('Civis Romanus', 'TIRO', 10, 0, 0, 1)`
    );
  }
}
