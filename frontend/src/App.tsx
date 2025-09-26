import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

interface Message {
  id: number | string;
  sender: 'user' | 'bot';
  content: string;
}

const API_BASE_URL = 'http://localhost:3000/messages';

const InitialBotMessage: Message = {
    id: 'initial_welcome',
    sender: 'bot',
    content: 'Olá! Sou o PizzaBot, seu assistente virtual. Bem-vindo(a) à nossa pizzaria! Como posso te ajudar com o seu pedido hoje?',
};

function App() {
  const [messages, setMessages] = useState<Message[]>([InitialBotMessage]);
  const [input, setInput] = useState('');
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // 1. Funções de Busca e Limpeza
  
  const clearAndFetchMessages = async () => {
      try {
          // Limpa o histórico no backend 
          await axios.delete(API_BASE_URL);
          
          setMessages([InitialBotMessage]);
          
          fetchMessages();
      } catch (error) {
           console.error('Erro durante o refresh da sessão:', error);
      }
  };
  
  const fetchMessages = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      const history = response.data as Message[];
      
      const newMessages = new Set<Message>();
      newMessages.add(InitialBotMessage);

      history.forEach(msg => {
          if (msg.id !== 'initial_welcome') {
              newMessages.add(msg);
          }
      });

      setMessages(Array.from(newMessages));

    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };
  
  useEffect(() => {
    clearAndFetchMessages(); // Limpa e carrega ao montar o componente
  }, []);

  useEffect(() => {
    // Rola o chat para baixo
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Função de Envio
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    try {
      // Adiciona a mensagem do usuário imediatamente ao estado
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

  //  Renderização
  
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