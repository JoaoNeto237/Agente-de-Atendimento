import { Router } from 'express';
import { handleNewMessage, getMessageHistory, clearChatHistory } from '../controllers/messagesController';

const router = Router();

router.post('/', handleNewMessage);
router.get('/', getMessageHistory);
router.delete('/', clearChatHistory);

export default router;