import request from 'supertest';
import express from 'express';
import { openDb } from '../database/sqlite';
import messagesRoutes from '../routes/messagesRoutes';

const app = express();
app.use(express.json());
app.use('/messages', messagesRoutes);

beforeAll(async () => {
  const db = await openDb();
  await db.exec('DELETE FROM messages;');
});

describe('API de Mensagens (Testes de Integração)', () => {

  it('deve enviar uma mensagem do usuário e receber uma resposta do bot', async () => {
    const response = await request(app)
      .post('/messages')
      .send({ message: "Quais sabores de pizza?" });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('reply');
    expect(response.body.reply).toContain('Temos os seguintes sabores de pizza');
  });

  it('deve retornar o histórico de mensagens após o envio', async () => {
    const response = await request(app)
      .get('/messages');
      
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThanOrEqual(2); 
    expect(response.body[0].sender).toBe('user');
    expect(response.body[1].sender).toBe('bot');
  });

});