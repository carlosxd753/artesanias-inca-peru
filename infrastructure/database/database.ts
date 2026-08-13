import * as SQLite from "expo-sqlite";

export const dbPromise = SQLite.openDatabaseAsync("artesanias.db");

export const initDatabase = async () => {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  console.log("[SQLITE] Base de datos inicializada.");
};
