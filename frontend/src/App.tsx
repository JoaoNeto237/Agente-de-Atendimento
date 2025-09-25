import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  return (
    <div className="chat-container">
      <div className="chat-history">
        {/* O histórico de mensagens será exibido aqui */}
      </div>
      <div className="chat-input">
        {/* O campo para digitar a mensagem estará aqui */}
      </div>
    </div>
  );
}

export default App;