# 🍕 PizzaBot - Agente de Atendimento com IA

Este projeto implementa um sistema full-stack com um **Agente de Atendimento Inteligente baseado em regras** para uma pizzaria.
O objetivo é simular um vendedor digital que segue regras estritas para maximizar as vendas e manter a fidelidade ao cardápio, sem oferecer descontos ou promoções.

---

## 🚀 Funcionalidades e Destaques

O projeto cumpre integralmente os requisitos do desafio, com foco na arquitetura em camadas e na robustez da IA.

### Backend (Node.js, TypeScript, Express, SQLite)

* **Agente de IA (Rule-Based):** Implementação de lógica de vendas com sistema de **contexto de conversação (`lastOffer`)**.
* O bot lembra qual foi a última oferta feita para insistir na próxima etapa de venda (Pizza → Bebida → Sobremesa).
* **Conformidade 100%:** O bot adere estritamente às regras de vendas (negação de descontos, foco exclusivo no cardápio).
* **API REST:** Endpoints para gerenciamento do chat:
    * `POST /messages`: Recebe a mensagem do usuário e retorna a resposta da IA, salvando ambas no DB.
    * `GET /messages`: Retorna o histórico da conversa.
    * `DELETE /messages`: Limpa o histórico no banco de dados, usado para iniciar novas sessões no frontend.
* **Persistência:** Utiliza **SQLite** para armazenar o histórico de mensagens.
* **Boas Práticas:** Arquitetura em camadas (Controller, Service, Database) e uso de TypeScript.

### Frontend (React, Vite, TypeScript)

* **Interface de Chat:** Tela simples com campo de input e exibição de histórico.
* **Experiência do Usuário (UX):**
    * Sempre inicia com uma **mensagem de boas-vindas** ao carregar.
    * Utiliza o endpoint `DELETE` para **limpar o histórico automaticamente** no refresh, garantindo uma nova sessão de atendimento a cada visita.
    * Rolagem automática para a mensagem mais recente.

---

## ✅ Extra

1.  **Testes Automatizados:** Implementação de **Testes Unitários (Jest)** para validar a lógica de vendas do Agente de IA e **Testes de Integração (Supertest)** para garantir o funcionamento das rotas da API.
2.  **Organização Git:** Uso de **Conventional Commits** e fluxo de trabalho com branches de *feature* para isolamento de código (`feat/api-messages`, `feat/frontend-chat`).

---

## 🛠️ Como Rodar o Projeto Localmente

Para iniciar o sistema full-stack, você precisará de dois terminais abertos.

### 1. Preparação (Instalação)

Na pasta raiz do projeto (`agente_pizzaria`), instale as dependências para o Backend e o Frontend:

```bash
# Na pasta backend
cd backend
npm install

# Na pasta frontend
cd ../frontend
npm install

2. Iniciar o Backend
Abra o primeiro terminal na pasta backend para iniciar a API.

Bash

cd backend
npm run dev
(O backend rodará em http://localhost:3000.)

3. Iniciar o Frontend
Abra o segundo terminal na pasta frontend para iniciar o cliente React.

Bash

cd frontend
npm run dev
(O frontend rodará em http://localhost:5173.)
