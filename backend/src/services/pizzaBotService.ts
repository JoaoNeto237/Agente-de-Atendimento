interface OrderedItem {
    name: string;
    quantity: number;
}

interface Context {
    stage: 'initial' | 'pizza_ordered' | 'drink_offered' | 'dessert_offered' | 'completed';
    pizzas: OrderedItem[];
    bebidas: OrderedItem[];
    sobremesas: OrderedItem[];
}

export class PizzaBotService {
    private menu = {
        pizzas: ['Margherita', 'Calabresa', 'Portuguesa', 'Quatro Queijos', 'Frango com Catupiry', 'Napolitana'],
        bebidas: ['Coca-Cola', 'Guaraná', 'Suco de Laranja', 'Água Mineral', 'Cerveja Pilsen'],
        sobremesas: ['Petit Gateau', 'Mousse de Maracujá', 'Torta de Limão'],
        cardapio_doce: ['Doce de Leite', 'Chocolate com Morango']
    };

    private ctx: Context = { stage: 'initial', pizzas: [], bebidas: [], sobremesas: [] };

    private synonyms = {
        sim: ['sim', 'yes', 'quero', 'aceito', 'pode ser', 'claro', 'ok', 'blz', 'beleza', 'isso', 'perfeito', 'confirmo', 'positivo', 'vamos', 'dale', 'bora'],
        nao: ['não', 'nao', 'no', 'recuso', 'depois', 'agora não', 'agora nao', 'não quero', 'nao quero', 'nem', 'negativo', 'passa', 'próximo', 'proximo'],
        menu: ['cardápio', 'cardapio', 'menu', 'opções', 'opcoes', 'tem o que', 'o que tem', 'oq tem', 'quais', 'mostrar', 'ver'],
        ajuda: ['ajuda', 'help', 'socorro', 'não entendi', 'nao entendi', 'como funciona']
    };

    public handleMessage(message: string): string {
        const msg = this.normalize(message);

        if (this.matches(msg, this.synonyms.ajuda)) return this.help();
        if (this.matches(msg, this.synonyms.menu)) return this.showMenu();
        if (msg.includes('promocao') || msg.includes('desconto') || msg.includes('brinde') || msg.includes('oferta'))
            return "No momento não temos promoções, mas garantimos qualidade e sabor! 🍕";
        if (msg.includes('hamburguer') || msg.includes('sanduiche') || msg.includes('lanche'))
            return "Nossa especialidade é pizza! Que tal uma Margherita ou Quatro Queijos? 🍕";

        switch (this.ctx.stage) {
            case 'initial': return this.stageInitial(msg);
            case 'pizza_ordered': return this.stagePizza(msg);
            case 'drink_offered': return this.stageDrink(msg);
            case 'dessert_offered': return this.stageDessert(msg);
            default: return this.reset();
        }
    }

    private normalize(txt: string): string {
        return txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    }

    private matches(msg: string, list: string[]): boolean {
        return list.some(s => msg.includes(s));
    }

    private extractQty(msg: string): number {
        const words: { [k: string]: number } = {
            'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'tres': 3, 'três': 3,
            'quatro': 4, 'cinco': 5, 'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10
        };
        for (const [w, n] of Object.entries(words)) if (msg.includes(w)) return n;
        const num = msg.match(/\d+/);
        return num ? parseInt(num[0]) : 1;
    }

    private findItems(msg: string): { pizzas: OrderedItem[], bebidas: OrderedItem[], sobremesas: OrderedItem[] } {
        const result = { pizzas: [] as OrderedItem[], bebidas: [] as OrderedItem[], sobremesas: [] as OrderedItem[] };
        const parts = msg.split(/,| e | mais /);

        for (const part of parts) {
            const allItems = [
                ...this.menu.pizzas.map(p => ({ name: p, type: 'pizza' as const })),
                ...this.menu.cardapio_doce.map(p => ({ name: p, type: 'pizza' as const })),
                ...this.menu.bebidas.map(b => ({ name: b, type: 'bebida' as const })),
                ...this.menu.sobremesas.map(s => ({ name: s, type: 'sobremesa' as const }))
            ].sort((a, b) => b.name.length - a.name.length);

            for (const item of allItems) {
                if (part.includes(this.normalize(item.name))) {
                    const qty = this.extractQty(part);
                    const ordered = { name: item.name, quantity: qty };
                    if (item.type === 'pizza') result.pizzas.push(ordered);
                    else if (item.type === 'bebida') result.bebidas.push(ordered);
                    else result.sobremesas.push(ordered);
                    break;
                }
            }
        }
        return result;
    }

    private addItem(type: 'pizzas' | 'bebidas' | 'sobremesas', name: string, qty: number): void {
        const existing = this.ctx[type].find(i => i.name === name);
        if (existing) existing.quantity += qty;
        else this.ctx[type].push({ name, quantity: qty });
    }

    private format(items: OrderedItem[]): string {
        return items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    }

    private stageInitial(msg: string): string {
        const items = this.findItems(msg);

        if (items.pizzas.length > 0) {
            items.pizzas.forEach(p => this.addItem('pizzas', p.name, p.quantity));
            items.bebidas.forEach(b => this.addItem('bebidas', b.name, b.quantity));
            items.sobremesas.forEach(s => this.addItem('sobremesas', s.name, s.quantity));

            this.ctx.stage = 'pizza_ordered';
            const pList = this.format(this.ctx.pizzas);

            if (items.bebidas.length > 0 && items.sobremesas.length > 0) return this.finalize();
            if (items.bebidas.length > 0) {
                this.ctx.stage = 'drink_offered';
                return `Perfeito! ${pList} e ${this.format(this.ctx.bebidas)} adicionados! 🍕🥤\n\nDeseja sobremesas? Temos: ${this.menu.sobremesas.join(', ')}.`;
            }
            return `Excelente! ${pList} adicionado(s)! 🍕\n\nDeseja bebidas? Temos: ${this.menu.bebidas.join(', ')}.`;
        }

        if (msg.includes('pizza')) return `Temos: ${[...this.menu.pizzas, ...this.menu.cardapio_doce].join(', ')}.\n\nQual você quer? 🍕`;
        if (msg.includes('oi') || msg.includes('ola') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite'))
            return this.welcome();

        return `Desculpe, não entendi. 😅 Você pode pedir uma pizza, ver o cardápio ou pedir ajuda.\n\nQual pizza você gostaria?`;
    }

    private stagePizza(msg: string): string {
        const items = this.findItems(msg);

        if (this.matches(msg, this.synonyms.sim)) return `Ótimo! Temos: ${this.menu.bebidas.join(', ')}.\n\nQuantas e quais? 🥤`;
        if (this.matches(msg, this.synonyms.nao)) {
            this.ctx.stage = 'drink_offered';
            return `Sem problemas! 👍 Que tal sobremesas? Temos: ${this.menu.sobremesas.join(', ')}.`;
        }

        if (items.bebidas.length > 0) {
            items.bebidas.forEach(b => this.addItem('bebidas', b.name, b.quantity));
            if (items.sobremesas.length > 0) {
                items.sobremesas.forEach(s => this.addItem('sobremesas', s.name, s.quantity));
                return this.finalize();
            }
            this.ctx.stage = 'drink_offered';
            return `Perfeito! ${this.format(this.ctx.bebidas)} adicionado(s)! 🥤\n\nDeseja sobremesas? Temos: ${this.menu.sobremesas.join(', ')}.`;
        }

        if (items.pizzas.length > 0) {
            items.pizzas.forEach(p => this.addItem('pizzas', p.name, p.quantity));
            return `${this.format(this.ctx.pizzas)} no pedido! 🍕\n\nE bebidas? Temos: ${this.menu.bebidas.join(', ')}.`;
        }

        return `Temos: ${this.menu.bebidas.join(', ')}.\n\nOu responda "não" para sobremesas. 🥤`;
    }

    private stageDrink(msg: string): string {
        const items = this.findItems(msg);

        if (this.matches(msg, this.synonyms.sim)) return `Maravilha! Temos: ${this.menu.sobremesas.join(', ')}.\n\nQuantas e quais? 🍰`;
        if (this.matches(msg, this.synonyms.nao)) return this.finalize();

        if (items.sobremesas.length > 0) {
            items.sobremesas.forEach(s => this.addItem('sobremesas', s.name, s.quantity));
            return this.finalize();
        }

        if (items.pizzas.length > 0) {
            items.pizzas.forEach(p => this.addItem('pizzas', p.name, p.quantity));
            return `${this.format(this.ctx.pizzas)} adicionado(s)! 🍕\n\nE sobremesas? Temos: ${this.menu.sobremesas.join(', ')}.`;
        }

        if (items.bebidas.length > 0) {
            items.bebidas.forEach(b => this.addItem('bebidas', b.name, b.quantity));
            return `${this.format(this.ctx.bebidas)} adicionado(s)! 🥤\n\nE sobremesas? Temos: ${this.menu.sobremesas.join(', ')}.`;
        }

        return `Temos: ${this.menu.sobremesas.join(', ')}.\n\nOu "não" para finalizar. 🍰`;
    }

    private stageDessert(msg: string): string {
        return `Seu pedido já foi finalizado! 😊\n\n${this.reset()}`;
    }

    private finalize(): string {
        const resumo = [];
        if (this.ctx.pizzas.length) resumo.push(`🍕 Pizzas: ${this.format(this.ctx.pizzas)}`);
        if (this.ctx.bebidas.length) resumo.push(`🥤 Bebidas: ${this.format(this.ctx.bebidas)}`);
        if (this.ctx.sobremesas.length) resumo.push(`🍰 Sobremesas: ${this.format(this.ctx.sobremesas)}`);

        this.ctx.stage = 'completed';
        setTimeout(() => this.resetCtx(), 100);

        return `✅ Pedido Finalizado!${resumo.length ? '\n\nResumo:\n' + resumo.join('\n') : ''}\n\nSeu pedido está a caminho! Bom apetite! 🎉`;
    }

    private reset(): string {
        this.resetCtx();
        return this.welcome();
    }

    private resetCtx(): void {
        this.ctx = { stage: 'initial', pizzas: [], bebidas: [], sobremesas: [] };
    }

    private welcome(): string {
        return `Olá! Sou o PizzaBot! 🍕\n\nTemos: ${[...this.menu.pizzas, ...this.menu.cardapio_doce].join(', ')}.\n\nQual pizza você quer hoje?`;
    }

    private help(): string {
        return `🤖 Como funciona:\n\n1. Escolha sua pizza\n2. Ofereço bebidas\n3. Ofereço sobremesas\n4. Finalizo o pedido!\n\nVocê pode dizer o nome da pizza, ver o "cardápio" ou responder "sim"/"não".\n\nQual pizza você quer?`;
    }

    private showMenu(): string {
        return `📋 Cardápio:\n\n🍕 Pizzas Salgadas:\n${this.menu.pizzas.join(', ')}\n\n🍕 Pizzas Doces:\n${this.menu.cardapio_doce.join(', ')}\n\n🥤 Bebidas:\n${this.menu.bebidas.join(', ')}\n\n🍰 Sobremesas:\n${this.menu.sobremesas.join(', ')}\n\nQual pizza você quer?`;
    }
}

export const pizzaBotService = new PizzaBotService();