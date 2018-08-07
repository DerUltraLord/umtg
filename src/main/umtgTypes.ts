export interface Card {
    id : string,
    name : string,
    [others : string]: any,
}

export interface MagicSet {
    code: string,
    [others: string]: any,
}

export interface CardDecklist {
    name : string,
    amount : string,
}

export interface Deck {
    filename: string,
    name: string,
}

export interface DeckContents {
    cards: Card[],
    sideboard: Card[],
}