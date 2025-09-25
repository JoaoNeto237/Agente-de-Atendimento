import { menu } from '../utils/menu';

export const pizzaBotService = {
  handleMessage(userMessage: string) {
    const lowerCaseMessage = userMessage.toLowerCase();

    // 1. Regras de Proibição e Foco (Prioridade Alta)
    // Se o cliente perguntar sobre promoções, descontos ou brindes
    if (lowerCaseMessage.includes('desconto') || lowerCaseMessage.includes('promocao') || lowerCaseMessage.includes('brinde') || lowerCaseMessage.includes('oferta')) {
      return `Não temos descontos ou promoções no momento, mas garantimos a melhor qualidade e sabor!`;
    }

    // Se o cliente pedir algo que não seja pizza
    if (lowerCaseMessage.includes('hamburguer') || lowerCaseMessage.includes('outro lanche') || lowerCaseMessage.includes('não quero pizza')) {
      return `Entendo, mas nossa especialidade é a pizza. A Quatro Queijos, por exemplo, é super cremosa e feita com queijos selecionados. Vale a pena provar!`;
    }
    
    // 2. Regra de Pedido e Oferta (Prioridade Média)
    // Se o cliente pedir algo do cardápio de pizzas
    const orderMatch = menu.pizzas.find(pizza => lowerCaseMessage.includes(pizza.name.toLowerCase()));
    if (orderMatch) {
      return `Ótima escolha! A pizza de ${orderMatch.name} está saindo do forno! Deseja adicionar uma bebida para acompanhar? Temos ${menu.bebidas[0].name} e ${menu.bebidas[1].name}.`;
    }
    
    // Se o cliente pedir uma bebida
    const beverageMatch = menu.bebidas.find(bebida => lowerCaseMessage.includes(bebida.name.toLowerCase()));
    if (beverageMatch) {
      return `Perfeito! Adicionando ${beverageMatch.name} ao seu pedido. Para finalizar, posso te oferecer uma sobremesa? Nosso ${menu.sobremesas[0].name} com calda de chocolate é irresistível!`;
    }

    // Se o cliente recusar, oferece outra opção
    if (lowerCaseMessage.includes('não quero bebida') || lowerCaseMessage.includes('nenhuma bebida')) {
        return `Tudo bem! E para a sobremesa? Nosso pudim de leite é uma ótima pedida.`;
    }
    
    if (lowerCaseMessage.includes('não quero sobremesa') || lowerCaseMessage.includes('nenhuma sobremesa')) {
        return `Entendido. Seu pedido está quase pronto!`;
    }

    // 3. Regra de Informação (Prioridade Baixíssima)
    // Se o cliente perguntar sobre o cardápio
    if (lowerCaseMessage.includes('sabor') || lowerCaseMessage.includes('cardapio') || lowerCaseMessage.includes('menu')) {
      const pizzaList = menu.pizzas.map(p => p.name).join(', ');
      return `Temos os seguintes sabores de pizza: ${pizzaList}. A nossa ${menu.pizzas[1].name} é uma das mais pedidas, que tal experimentá-la?`;
    }

    // 4. Resposta Padrão
    return 'Olá! Sou o assistente virtual da pizzaria. O que gostaria de pedir hoje? Temos Margherita, Calabresa, Portuguesa e Quatro Queijos!';
  },
};