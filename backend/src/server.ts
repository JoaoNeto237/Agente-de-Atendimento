import express from 'express';
import cors from 'cors'; 
import { openDb } from './database/sqlite';
import messagesRoutes from './routes/messagesRoutes';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'DELETE'],
}));

app.use(express.json());

const port = 3000;

async function startServer() {
  try {
    await openDb();
    console.log('Conexão com o banco de dados SQLite estabelecida com sucesso!');
    
    app.use('/messages', messagesRoutes);
    
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Falha na conexão com o banco de dados:', error);
    process.exit(1);
  }
}

startServer();