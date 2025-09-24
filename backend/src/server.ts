import express from 'express';
import { openDb } from './database/sqlite'; // Importe a função de conexão

const app = express();
app.use(express.json());

const port = 3000;

// O servidor só irá "escutar" requisições após a conexão com o DB
async function startServer() {
  try {
    const db = await openDb();
    console.log('Conexão com o banco de dados SQLite estabelecida com sucesso!');
    
    // Suas rotas virão aqui depois
    // app.use('/messages', messagesRoutes);
    
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Falha na conexão com o banco de dados:', error);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
}

startServer();