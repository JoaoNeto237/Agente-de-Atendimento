import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/App.css';

// Interface para garantir a tipagem das mensagens
interface Message {
  id: number | string;
  sender: 'user' | 'bot';
  content: string;
}

const API_BASE_URL = 'http://localhost:3000/messages';

// Mensagem inicial de boas-vindas
const InitialBotMessage: Message = {
    id: 'initial_welcome',
    sender: 'bot',
    content: 'Olá! Sou o PizzaBot, seu assistente virtual. Bem-vindo(a) à nossa pizzaria! Como posso te ajudar com o seu pedido hoje?',
};

function App() {
  const [messages, setMessages] = useState<Message[]>([InitialBotMessage]);
  const [input, setInput] = useState('');
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // 1. FUNÇÕES DE BUSCA E LIMPEZA
  
  const fetchMessages = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      const history = response.data as Message[];
      
      const newMessages = new Set<Message>();
      newMessages.add(InitialBotMessage);

      // Adiciona o histórico do DB APÓS a mensagem inicial
      history.forEach(msg => {
          // Filtra a mensagem inicial, caso ela tenha sido salva acidentalmente no DB
          if (msg.id !== 'initial_welcome') {
              newMessages.add(msg);
          }
      });

      setMessages(Array.from(newMessages));

    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const clearAndFetchMessages = async () => {
      try {
          // Limpa o histórico no backend (DELETE)
          await axios.delete(API_BASE_URL);
          
          // Garante que a primeira mensagem seja a de boas-vindas
          setMessages([InitialBotMessage]);
          
          fetchMessages();
      } catch (error) {
           console.error('Erro durante o refresh da sessão:', error);
      }
  };
  
  // 2. EFEITOS E LIFECYCLE
  
  // Limpa e carrega o histórico ao montar o componente
  useEffect(() => {
    clearAndFetchMessages(); 
  }, []);

  // Rola o chat para baixo
  useEffect(() => {
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // 3. FUNÇÃO DE ENVIO
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    try {
      // Adiciona a mensagem do usuário imediatamente ao estado (UX)
      const tempUserMessage: Message = {
          id: Date.now(),
          sender: 'user',
          content: userMessage,
      };
      setMessages(prev => [...prev, tempUserMessage]);

      // Envia a mensagem para o backend
      await axios.post(API_BASE_URL, { message: userMessage });

      // Recarrega o histórico
      fetchMessages();

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // 4. RENDERIZAÇÃO
  
  return (
    <div className="chat-container">
      <h2 className="chat-header">🍕 PizzaBot Atendente IA</h2>
      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`message ${msg.sender}`}>
            <span className="sender-name">{msg.sender === 'bot' ? 'Bot' : 'Você'}</span>
            <p className="message-content">{msg.content}</p>
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite seu pedido ou pergunta..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;