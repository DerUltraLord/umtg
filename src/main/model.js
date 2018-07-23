const Settings = require('./settings.js');
const Scryfall = require('./scryfall.js');
const Db = require('./db.js');
const Deck = require('./deck.js');
const Base = require('./base.js');
const $ = require('jquery');
exports.init = (database) => {
    Settings.init();
    Db.init(database);
    exports.state.settings = Settings.data;
}

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

}

exports.searchScryfallByFilter = (filter) => {
    return Scryfall.searchByFilter(filter)
    .then((response) => exports.state.searchCards = updateCards(response.data));
    // TODO: has more??
    // TODO: empty response
}

exports.getScryfallSearchFilter = Scryfall.getSearchFilter;

// Collection
let saveSetsToDb = (res) => {
    res.data.forEach((set) => {
        Db.setAdd(set);
    });
    return Db.getSets()
}

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
            then((amount) => obj[set.code].ownedCards = amount)
            .catch(console.error);
            return obj;
        }, {});
    })
    .catch(console.error);


}

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
}



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
}

exports.updateCardsBySet = (set) => {
    return exports.getCardsOfSet(set)
    .then((cards) => {
        exports.state.setCards = cards.reduce((obj, card) => {
            obj[card.id] = card;
            obj[card.id].ownedAmount = 0;
            Db.getAmountOfCardById(card.id, (amount) => {
                obj[card.id].ownedAmount = amount;
            });

            return obj;
        }, {});
    })
    .catch(console.error);
    

}

let updateCardAmountOfCard = (card, amount) => {
    card = exports.state.setCards[card.id];
    card.ownedAmount = amount;
    Db.getOwnedCardAmountBySetCode(card.set)
    .then((amount) => exports.state.sets[card.set].ownedCards = amount)
    .catch(console.error);
}

exports.removeCardFromCollection = (card) => {
    return Db.cardExistsById(card.id)
    .then((exists) => {
        if (exists) {
            Db.cardAdjustAmount(card, -1)
            .then((amount) => updateCardAmountOfCard(card, amount))
            .catch(console.error);
        }
    })
    .catch(console.error);
}

exports.addCardToCollection = (card) => {
    return Db.cardExistsById(card.id)
    .then((exists) => {
        if (exists) {
            Db.cardAdjustAmount(card, 1)
            .then((amount) => updateCardAmountOfCard(card, amount))
            .catch(console.error);
        } else {
            Db.cardAdd(card, 1);
            updateCardAmountOfCard(card, 1);
        }
    })
    .catch(console.error);
}

exports.getPercentageOfSet = Db.getPercentageOfSet


// Decks

exports.updateDecks = () => {
    return Deck.getDecks()
    .then((decks) => exports.state.decks = decks)
    .catch(console.error);
}

exports.updateDeckCards = (deck) => {
    // TODO: sideboard
    return Deck.getCardsOfDeck(deck)
    .then((deck) => exports.state.deckCards = updateCards(deck.cards))
    .catch(console.error);
}


// State

exports.state = {
    settings: null,
    sets: {},
    searchCards: {},
    setCards: {},
    deckCards: {},
    decks: [],
    selectedDeck: null,
}
