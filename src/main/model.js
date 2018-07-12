const Settings = require('./settings.js');
const Scryfall = require('./scryfall.js');
const Db = require('./db.js');
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
exports.searchScryfallByFilter = Scryfall.searchByFilter;
exports.getScryfallSearchFilter = Scryfall.getSearchFilter;

// Collection
let saveSetsToDb = (res) => {
    res.data.forEach((set) => {
        Db.setAdd(set);
    });
    return Db.getSets()
}

exports.getSets = () => {
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


exports.state = {
    settings: null,
}
