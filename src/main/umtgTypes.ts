export interface Card {
    id: string;
    name: string;
    ownedAmount?: number;
    [others: string]: any;
}

export interface MagicSet {
    code: string;
    collectionAmount?: number;
    downloaded?: boolean;
    [others: string]: any;
}

export interface Deck {
    filename: string;
    name: string;
}

export interface DeckWithCards {
    deck: Deck;
    cards: Card[];
    sideboard: Card[];
    cardAmount: Dict<number>;
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

export interface Page {
    name: string;
}

export interface SearchPage extends Page {
    cards: Dict<Card>;
    selectedCard: Card | null;
}

export interface CollectionPage extends Page{
    cards: Dict<Card>;
    selectedCard: Card | null;
    sets: Dict<MagicSet>;
}

export interface DecksPage extends Page {
    selectedDeck: DeckWithCards | null;    
    selectedCard: Card | null;
    decks: Deck[];
}


export interface Pages {
    search: SearchPage;
    collection: CollectionPage;
    decks: DecksPage;
    settings: Page;
    about: Page;
}

export interface UmtgState {
    currentPage: string;
    pages: Pages;
    settings: any;
    selectedSet: MagicSet | null;
    events: any;
}
