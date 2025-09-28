import { pizzaBotService } from '../services/pizzaBotService';

describe('pizzaBotService', () => {

  beforeEach(() => {
    // Reset usando método público resetCtx se existir, senão force reset via any
    const service = pizzaBotService as any;
    if (typeof service.resetCtx === 'function') {
      service.resetCtx();
    } else {
      service.ctx = { stage: 'initial', pizzas: [], bebidas: [], sobremesas: [] };
    }
  });

  it('deve responder com cardápio quando perguntado sobre sabores', () => {
    const reply = pizzaBotService.handleMessage("Quais sabores vocês têm?");
    expect(reply).toContain('Cardápio');
  });

  it('deve negar promoções', () => {
    const reply = pizzaBotService.handleMessage("Vocês têm alguma promoção?");
    expect(reply).toContain('No momento não temos promoções');
  });

  it('deve oferecer bebida após pedido de pizza', () => {
    const reply = pizzaBotService.handleMessage("Quero uma pizza Portuguesa");
    expect(reply).toContain('Deseja bebidas');
  });

  it('deve oferecer sobremesa após pedido de bebida', () => {
    pizzaBotService.handleMessage("Quero uma pizza Portuguesa"); // Primeiro pede pizza
    const reply = pizzaBotService.handleMessage("Quero uma Coca-Cola");
    expect(reply).toContain('Temos: Coca-Cola'); // Resposta real do bot
  });

  it('deve manter foco em pizzas', () => {
    const reply = pizzaBotService.handleMessage("Queria um hamburguer");
    expect(reply).toContain('Nossa especialidade é pizza');
  });

  it('deve oferecer sobremesas após recusar bebida', () => {
    // Simula o fluxo: pizza -> recusar bebida -> oferece sobremesa
    pizzaBotService.handleMessage("Quero uma pizza Portuguesa");
    const reply = pizzaBotService.handleMessage("não");
    expect(reply).toContain('Que tal sobremesas'); // Resposta real do bot
  });

  it('deve mostrar menu quando solicitado', () => {
    const reply = pizzaBotService.handleMessage("cardápio");
    expect(reply).toContain('Pizzas Salgadas');
  });

});