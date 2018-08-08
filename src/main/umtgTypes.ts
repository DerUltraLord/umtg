export interface Card {
    id: string;
    name: string;
    [others: string]: any;
}

export interface MagicSet {
    code: string;
    [others: string]: any;
}

export interface Deck {
    filename: string;
    name: string;
}

export interface DeckWithCards {
    cards: Card[];
    sideboard: Card[];
}

export interface Decklist {
    cards: DecklistCard[];
    sideboard: DecklistCard[];
}

export interface DecklistCard {
    name: string;
    amount: number;
}

export interface Dict<T> {
    [others: string]: T;
}

export interface Settings {
    setTypes: any;
    isGridActive: boolean;
}
