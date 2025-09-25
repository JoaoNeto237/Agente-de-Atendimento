import { menu } from '../utils/menu';

export const pizzaBotService = {
  handleMessage(userMessage: string) {
    const lowerCaseMessage = userMessage.toLowerCase();

    // 1. Fidelidade ao Cardápio e Força de Venda
    if (lowerCaseMessage.includes('sabor') || lowerCaseMessage.includes('cardapio')) {
      const pizzaList = menu.pizzas.map(p => p.name).join(', ');
      return `Temos os seguintes sabores de pizza: ${pizzaList}. A nossa ${menu.pizzas[1].name} é uma das mais pedidas, que tal experimentá-la?`;
    }

    if (lowerCaseMessage.includes('não quero pizza') || lowerCaseMessage.includes('outro lanche')) {
      return `Entendo, mas nossa especialidade é a pizza. A Quatro Queijos, por exemplo, é super cremosa e feita com queijos selecionados. Vale a pena provar!`;
    }
    
    // 2. Oferta Condicional de Produtos (Bebidas e Sobremesas)
    const orderMatch = menu.pizzas.find(pizza => lowerCaseMessage.includes(pizza.name.toLowerCase()));
    if (orderMatch) {
      return `Ótima escolha! A pizza de ${orderMatch.name} está saindo do forno! Deseja adicionar uma bebida para acompanhar? Temos ${menu.bebidas[0].name} e ${menu.bebidas[1].name}.`;
    }
    
    const beverageMatch = menu.bebidas.find(bebida => lowerCaseMessage.includes(bebida.name.toLowerCase()));
    if (beverageMatch) {
      return `Perfeito! Adicionando ${beverageMatch.name} ao seu pedido. Para finalizar, posso te oferecer uma sobremesa? Nosso ${menu.sobremesas[0].name} com calda de chocolate é irresistível!`;
    }
    
    // Se o cliente recusar, oferece outra opção
    if (lowerCaseMessage.includes('não quero bebida') || lowerCaseMessage.includes('nenhuma bebida')) {
        return `Tudo bem! E para a sobremesa? Nosso pudim de leite é uma ótima escolha.`;
    }
    
    if (lowerCaseMessage.includes('não quero sobremesa') || lowerCaseMessage.includes('nenhuma sobremesa')) {
        return `Entendido. Seu pedido está quase pronto!`;
    }

    // 3. Proibição de Ofertas Indevidas
    if (lowerCaseMessage.includes('desconto') || lowerCaseMessage.includes('promocao') || lowerCaseMessage.includes('brinde')) {
      return `Não temos descontos ou promoções no momento, mas garantimos a melhor qualidade e sabor!`;
    }

    return 'Olá! Sou o assistente virtual da pizzaria. O que gostaria de pedir hoje? Temos Margherita, Calabresa, Portuguesa e Quatro Queijos!';
  },
};