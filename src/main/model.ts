import * as Settings from './settings';
import * as Scryfall from './scryfall';
import * as Db from './db';
import { getDecks, getCardsOfDeck } from './deck';
import * as Base from './base';
import { MagicSet, Dict, Card, Deck } from './umtgTypes';

// Settings
export function setGridActive(status: boolean) {
    return Settings.setGridActive(status);
}

export function setSetTypeVisible(set: string, status: boolean) {
    return Settings.setSetTypeVisible(set, status);
}

// Scryfall
let updateCards = (cards: Card[]) => {
    let initalValue: Dict<Card> = {};
    return cards.reduce((obj: Dict<Card>, card: Card) => {
        obj[card.id] = card;
        obj[card.id].ownedAmount = 0;
        Db.getAmountOfCardById(card.id, (amount) => {
            obj[card.id].ownedAmount = amount;
        });
        return obj;
    }, initalValue);
};

export function searchScryfallByFilter(filter: string) {
    return Scryfall.searchByFilter(filter)
        .then((response: any) => exports.state.pages.search.cards = updateCards(response.data));
    // TODO: has more??
    // TODO: empty response
}

export function getScryfallSearchFilter(name: string, type?: string) {
    return Scryfall.getSearchFilter(name, type);
}

// Collection
let saveSetsToDb = (res: any) => {
    res.data.forEach((set: MagicSet) => {
        Db.setAdd(set);
    });
    return Db.getSets();
};

function getSets(): Promise<MagicSet[]> {
    return new Promise((success, failure) => {

        Db.getSets()
            .then((sets) => {
                if (sets.length === 0) {
                    Scryfall.scryfallGetSets()
                        .then(saveSetsToDb)
                        .then(success)
                        .catch(failure);
                } else {
                    success(sets);
                }
            })
            .catch(failure) ;
    });
}

export function updateSets() {
    let initialValue: Dict<MagicSet> = {};
    return getSets()
        .then((sets) => {
            let filteredSets = sets.filter((set) => exports.state.settings.setTypes[set.set_type]);
            exports.state.sets = filteredSets.reduce((obj, set) => {
                set.ownedAmount = null;
                obj[set.code] = set;
                obj[set.code].ownedCards = 0;
                Db.getOwnedCardAmountBySetCode(set.code).
                    then((amount) => obj[set.code].ownedCards = amount);
                return obj;
            }, initialValue);
        });
}

let storeSetCardsFromScryfallInDb = (uri: string, success: () => void) => {
    Base.getJSONCb(uri, (res: any) => {
        res.data.forEach((card: Card) => {
            Db.cardAdd(card, 0);
        });

        if (res.has_more) {
            storeSetCardsFromScryfallInDb(res.next_page, success);
        } else {
            success();
        }
    });
};

export function getCardsOfSet(set: MagicSet): Promise<Card[]> {
    return new Promise((success, failure) => {

        Db.getCardsOfSet(set)
            .then((cards: Card[]) => {

                if (cards.length < set.card_count) {
                    storeSetCardsFromScryfallInDb(set.search_uri, () => {
                        Db.db.serialize(() => {
                            Db.getCardsOfSet(set)
                                .then(success)
                                .catch(failure);
                        });
                    });
                } else {
                    success(cards);
                }
            })
            .catch(failure);
    });
}

export function updateCardsBySet(set: MagicSet) {
    return exports.getCardsOfSet(set)
        .then((cards: Card[]) => {
            let initalValue: Dict<Card> = {};
            exports.state.pages.collection.cards = cards.reduce((obj, card) => {
                obj[card.id] = card;
                obj[card.id].ownedAmount = 0;
                Db.getAmountOfCardById(card.id, (amount) => {
                    obj[card.id].ownedAmount = amount;
                });

                return obj;
            }, initalValue);
        });
}

let updateCardAmountOfCard = (card: Card, amount: number) => {
    card = exports.state.pages.collection.cards[card.id];
    card.ownedAmount = amount;
    Db.getOwnedCardAmountBySetCode(card.set)
        .then((amount) => exports.state.sets[card.set].ownedCards = amount);
};

export function removeCardFromCollection(card: Card) {
    return Db.cardExistsById(card.id)
        .then((exists) => {
            if (exists) {
                Db.cardAdjustAmount(card, -1)
                    .then((amount) => updateCardAmountOfCard(card, amount));
            }
        });
}

export function addCardToCollection(card: Card) {
    return Db.cardExistsById(card.id)
        .then((exists) => {
            if (exists) {
                Db.cardAdjustAmount(card, 1)
                    .then((amount) => updateCardAmountOfCard(card, amount));
            } else {
                Db.cardAdd(card, 1);
                updateCardAmountOfCard(card, 1);
            }
        });
}

export function getPercentageOfSet(set: MagicSet): Promise<number> {
    return Db.getPercentageOfSet(set);
}

// Decks
export function updateDecks() {
    exports.state.decks = getDecks();
    if (exports.state.decks.length > 0) {
        getCardsOfDeck(exports.state.decks[0])
            .then((deck) => {
                exports.state.pages.decks.cards = deck.cards;
            });
    }
}

export function updateDeckCards(deck: Deck) {
    // TODO: sideboard
    return getCardsOfDeck(deck)
        .then((deck) => exports.state.pages.decks.cards = updateCards(deck.cards));
}

export function createDeck(name: string) {
    // Deck.createDeck(name);
    // exports.updateDecks();
}

export function addCardToDeck(deck: Deck, card: Card) {
    // Deck.addCardToDeck(deck, card)
        //  .then((deck) => exports.state.pages.decks.cards = deck.cards);
}

// State
export async function init(database: string) {
    Settings.init();
    Db.init(database);
    exports.state.settings = Settings.data;
    await exports.updateDecks();
    if (exports.state.decks.length > 0) {
        exports.state.selectedDeck = exports.state.decks[0];
    }
}

let state = {
    currentPage: 'search',
    pages: {
        search: {
            name: 'Seach',
            cards: {},
            selectedCard: null
        },
        collection: {
            name: 'Collection',
            cards: {},
            selectedCard: null
        },
        decks: {
            name: 'Decks',
            cards: {},
            selectedCard: null
        },
        settings: {
            name: 'Settings'
        },
        about: {
            name: 'About'
        }
    },
    settings: null,
    sets: {},
    decks: [],
    selectedDeck: null,
    selectedSet: null,
    events: null
};

export { state };
