import * as Settings from './settings';
import * as Scryfall from './scryfall';
import * as Db from './db';
import * as Deck from './deck';
import * as Base from './base';
import { MagicSet } from './umtgTypes';


// Settings
export function setGridActive(status : boolean) {
    return Settings.setGridActive(status);
}

export function setSetTypeVisible(set : string, status : boolean) {
    return Settings.setSetTypeVisible(set, status);
}

// Scryfall
let updateCards = (cards) => {
    return cards.reduce((obj, card) => {
        obj[card.id] = card;
        obj[card.id].ownedAmount = 0;
        Db.getAmountOfCardById(card.id, (amount) => {
            obj[card.id].ownedAmount = amount;
        });
        return obj;
    }, {});

};

export function searchScryfallByFilter(filter) {
    return Scryfall.searchByFilter(filter)
        .then((response) => exports.state.pages.search.cards = updateCards(response.data));
    // TODO: has more??
    // TODO: empty response
};

export function getScryfallSearchFilter(name : string, type? : string) {
    return Scryfall.getSearchFilter(name, type);
}

// Collection
let saveSetsToDb = (res) => {
    res.data.forEach((set) => {
        Db.setAdd(set);
    });
    return Db.getSets();
};

function getSets() : Promise<MagicSet[]> {
    return new Promise((success, failure) => {

        Db.getSets()
            .then((sets) => {
                if (sets.length == 0) {
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
};


export function updateSets() {
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
            }, {});
        });
};

let storeSetCardsFromScryfallInDb = (uri, success) => {
    Base.getJSONCb(uri, (res) => {
        res.data.forEach((card) => {
            Db.cardAdd(card, 0);
        });

        if (res.has_more) {
            storeSetCardsFromScryfallInDb(res.next_page, success);
        } else {
            success();
        }
    });
};



export function getCardsOfSet(set) : Promise<any> {
    return new Promise((success, failure) => {

        Db.getCardsOfSet(set)
            .then((cards) => {

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
};

export function updateCardsBySet(set) {
    return exports.getCardsOfSet(set)
        .then((cards) => {
            exports.state.pages.collection.cards = cards.reduce((obj, card) => {
                obj[card.id] = card;
                obj[card.id].ownedAmount = 0;
                Db.getAmountOfCardById(card.id, (amount) => {
                    obj[card.id].ownedAmount = amount;
                });

                return obj;
            }, {});
        });
};

let updateCardAmountOfCard = (card, amount) => {
    card = exports.state.pages.collection.cards[card.id];
    card.ownedAmount = amount;
    Db.getOwnedCardAmountBySetCode(card.set)
        .then((amount) => exports.state.sets[card.set].ownedCards = amount);
};

export function removeCardFromCollection(card) {
    return Db.cardExistsById(card.id)
        .then((exists) => {
            if (exists) {
                Db.cardAdjustAmount(card, -1)
                    .then((amount) => updateCardAmountOfCard(card, amount));
            }
        });
};

export function addCardToCollection(card) {
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
};

export function getPercentageOfSet(set : MagicSet) : Promise<number> {
    return Db.getPercentageOfSet(set);
}


// Decks

export function updateDecks() {
    exports.state.decks = Deck.getDecks();
    if (exports.state.decks.length > 0) {
        Deck.getCardsOfDeck(exports.state.decks[0])
            .then((deck) => {
                exports.state.pages.decks.cards = deck.cards;
            });
    }
};

export function updateDeckCards(deck) {
    // TODO: sideboard
    return Deck.getCardsOfDeck(deck)
        .then((deck) => exports.state.pages.decks.cards = updateCards(deck.cards));
};

export function createDeck(name) {
    //Deck.createDeck(name);
    //exports.updateDecks();
};

export function addCardToDeck(deck, card) {
    //Deck.addCardToDeck(deck, card)
        //.then((deck) => exports.state.pages.decks.cards = deck.cards);
};


// State
export async function init(database) {
    Settings.init();
    Db.init(database);
    exports.state.settings = Settings.data;
    await exports.updateDecks();
    if (exports.state.decks.length > 0) {
        exports.state.selectedDeck = exports.state.decks[0];
    }
};


export let state = {
    currentPage: 'search',
    pages: {
        search: {
            name: 'Seach',
            cards: {},
            selectedCard: null,
        },
        collection: {
            name: 'Collection',
            cards: {},
            selectedCard: null,
        },
        decks: {
            name: 'Decks',
            cards: {},
            selectedCard: null,
        },
        settings: {
            name: 'Settings',
        },
        about: {
            name: 'About'
        },
    },
    settings: null,
    sets: {},
    decks: [],
    selectedDeck: null,
    selectedSet: null,
    events: null,
};
