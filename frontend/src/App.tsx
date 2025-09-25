import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Interface para tipagem das mensagens
interface Message {
  id: number;
  sender: 'user' | 'bot'; 
  content: string;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:3000/messages';

function App() {
  // Estado para armazenar o histórico de mensagens
  const [messages, setMessages] = useState<Message[]>([]);
  // Estado para armazenar o texto que o usuário está digitando
  const [input, setInput] = useState('');

  // Carrega o histórico ao montar o componente
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // Faz uma requisição GET para o seu backend
      const response = await axios.get(API_BASE_URL);
      setMessages(response.data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  // Função chamada ao enviar o formulário
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput(''); // Limpa o campo de input imediatamente

    try {
      // 1. Faz uma requisição POST com a mensagem do usuário para o backend
      await axios.post(API_BASE_URL, { message: userMessage });
      
      // 2. Após o backend salvar e responder, recarrega o histórico completo
      fetchMessages(); 

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Opcional: Adicionar mensagem de erro ao histórico
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">🍕 PizzaBot Atendente IA</h2>
      <div className="chat-history">
        {/* Mapeia e exibe as mensagens */}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <span className="sender-name">{msg.sender === 'bot' ? 'Bot' : 'Você'}</span>
            <p className="message-content">{msg.content}</p>
          </div>
        ))}
      </div>
      {/* Formulário de input que chama a função sendMessage */}
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