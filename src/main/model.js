const Settings = require('./settings.js');
const Scryfall = require('./scryfall.js');
const Db = require('./db.js');
const Deck = require('./deck.js');
const Base = require('./base.js');


// Settings
exports.setGridActive = Settings.setGridActive;
exports.setSetTypeVisible = Settings.setSetTypeVisible;

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

exports.searchScryfallByFilter = (filter) => {
    return Scryfall.searchByFilter(filter)
        .then((response) => exports.state.pages.search.cards = updateCards(response.data));
    // TODO: has more??
    // TODO: empty response
};

exports.getScryfallSearchFilter = Scryfall.getSearchFilter;

// Collection
let saveSetsToDb = (res) => {
    res.data.forEach((set) => {
        Db.setAdd(set);
    });
    return Db.getSets();
};

let getSets = () => {
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


exports.updateSets = () => {
    return getSets()
        .then((sets) => {
            let filteredSets = sets.filter(set => exports.state.settings.setTypes[set.set_type]);
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



exports.getCardsOfSet = (set) => {
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

exports.updateCardsBySet = (set) => {
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

exports.removeCardFromCollection = (card) => {
    return Db.cardExistsById(card.id)
        .then((exists) => {
            if (exists) {
                Db.cardAdjustAmount(card, -1)
                    .then((amount) => updateCardAmountOfCard(card, amount));
            }
        });
};

exports.addCardToCollection = (card) => {
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

exports.getPercentageOfSet = Db.getPercentageOfSet;


// Decks

exports.updateDecks = () => {
    exports.state.decks = Deck.getDecks();
    if (exports.state.decks.length > 0) {
        Deck.getCardsOfDeck(exports.state.decks[0])
            .then((deck) => {
                exports.state.pages.decks.cards = deck.cards;
            });
    }
};

exports.updateDeckCards = (deck) => {
    // TODO: sideboard
    return Deck.getCardsOfDeck(deck)
        .then((deck) => exports.state.pages.decks.cards = updateCards(deck.cards));
};

exports.createDeck = (name) => {
    Deck.createDeck(name);
    exports.updateDecks();
};

exports.addCardToDeck = (deck, card) => {
    Deck.addCardToDeck(deck, card)
        .then((deck) => exports.state.pages.decks.cards = deck.cards);
};


// State
exports.init = async (database) => {
    Settings.init();
    Db.init(database);
    exports.state.settings = Settings.data;
    await exports.updateDecks();
    if (exports.state.decks.length > 0) {
        exports.state.selectedDeck = exports.state.decks[0];
    }
};


exports.state = {
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
