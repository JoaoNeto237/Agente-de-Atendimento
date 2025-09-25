import { Request, Response } from 'express';
import { openDb } from '../database/sqlite';
import { pizzaBotService } from '../services/pizzaBotService'

export const handleNewMessage = async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'A mensagem é obrigatória.' });
  }

  try {
    const db = await openDb();

    // Salva a mensagem do usuário no banco
    await db.run('INSERT INTO messages (sender, content) VALUES (?, ?)', ['user', message]);

    // Obtém a resposta da IA
    const botReply = pizzaBotService.handleMessage(message);

    // Salva a resposta do bot no banco
    await db.run('INSERT INTO messages (sender, content) VALUES (?, ?)', ['bot', botReply]);

    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getMessageHistory = async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const messages = await db.all('SELECT * FROM messages ORDER BY timestamp ASC');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};