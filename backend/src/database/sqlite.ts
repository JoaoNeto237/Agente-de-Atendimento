//criar conexao com banco de dados sqlite
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

//abrir conexao com banco de dados sqlite
export async function openDb() {
  const db = await open({
    filename: './db/messages.db',
    driver: sqlite3.Database,
  });

   await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}