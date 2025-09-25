import { Router } from 'express';
import { handleNewMessage, getMessageHistory } from '../controllers/messagesController';

const router = Router();

// Rota para enviar uma nova mensagem
router.post('/', handleNewMessage);

// Rota para buscar o histórico de mensagens
router.get('/', getMessageHistory);

export default router;