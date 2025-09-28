import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

let db: Database | null = null;

// Função para abrir e inicializar a conexão
export async function openDb(): Promise<Database> {
    if (db) return db;

    db = await open({
        filename: './db/messages.db',
        driver: sqlite3.Database,
    });

    // Cria a tabela se não existir
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

export async function clearMessages(): Promise<void> {
    const db = await openDb();
    
    //  Apaga todos os registros da tabela 'messages'
    await db.run('DELETE FROM messages');

    //  Reseta o contador de ID para começar do 1 novamente
    await db.run("DELETE FROM sqlite_sequence WHERE name='messages'");
    
    console.log('Histórico de mensagens anteriores apagado com sucesso.');
}