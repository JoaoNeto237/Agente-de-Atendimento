import { pizzaBotService } from '../services/pizzaBotService';
import { menu } from '../utils/menu';

describe('pizzaBotService (Testes Unitários)', () => {

  it('deve responder com o cardápio de pizzas quando perguntado sobre sabores', () => {
    const message = "Quais sabores vocês têm?";
    const reply = pizzaBotService.handleMessage(message);
    const expectedPizzaList = menu.pizzas.map(p => p.name).join(', ');
    expect(reply).toContain(expectedPizzaList);
    expect(reply).toContain('Calabresa');
  });

  it('deve negar descontos, promoções ou brindes', () => {
    const message = "Vocês têm alguma promocao?"; 
    const reply = pizzaBotService.handleMessage(message);
    expect(reply).toContain('Não temos descontos ou promoções'); 
  });

  it('deve oferecer bebida após um pedido de pizza', () => {
    const message = "Quero uma pizza Portuguesa";
    const reply = pizzaBotService.handleMessage(message);
    expect(reply).toContain('Deseja adicionar uma bebida');
    expect(reply).toContain(menu.bebidas[0].name); 
  });

  it('deve oferecer sobremesa após um pedido de bebida', () => {
    const message = "Quero um suco";
    const reply = pizzaBotService.handleMessage(message);
    expect(reply).toContain('posso te oferecer uma sobremesa?');
    expect(reply).toContain(menu.sobremesas[0].name); 
  });
  
  it('deve manter o foco em pizzas se o cliente pedir outro tipo de comida', () => {
    const message = "Queria um hamburguer"; 
    const reply = pizzaBotService.handleMessage(message);
    expect(reply).toContain('nossa especialidade é a pizza'); 
    expect(reply).toContain('Quatro Queijos');
  });
});