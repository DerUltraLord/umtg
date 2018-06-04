var fs = require('fs');
var db = require('./db.js');
var scry = require('./scryfall.js');
var decksPath = process.env.HOME + '/.umtg/decks';

if (!fs.existsSync(decksPath)) {
    fs.mkdirSync(decksPath);
}


class Deck {
    constructor(name) {
        this.name = name;
    }
}


exports.getDecks = function(callback) {
    fs.readdir(decksPath, function(err, files) {
        var res = [];
        files.forEach(file => {
            res.push(new Deck(file));
        })
        callback(res);
    });
}

exports.getCardsOfDeck = function(deckname, callback) {
    fs.readFile(decksPath + "/" + deckname, 'ascii', function(err, data) {

        // TODO: handle sideboard
        let deckResult = exports.traverseCards(data);

        let cards = deckResult['cards'];


        var addedIds = [];

        cards.forEach((card) => {
            db.cardExistsByName(card.name, function(exists) {
                if (exists == false) {
                    scry.getCardByName(card.name, function(card) {
                        if (addedIds.indexOf(card.id, addedIds) == -1) {
                            db.cardAdd(card, 0);
                            addedIds.push(card.id);
                            callback(card);
                        }
                    });
                } else {
                    db.getCardByName(card.name, function(card) {
                        callback(card);
                    });
                }
            });
        });
    })
}

exports.addCardToDeck = function(card, deck) {

    exports.getCardsOfDeck(deck, (c) => {
        if (card.name == c.name) {
            
        }
    });
}

exports._lineMatchCard = (line) => {
    let re = /(\d+)\s(.*)/;
    let match = re.exec(line);

    let result = null;
    if (match) {
        let cardname = match[2];
        let amount = match[1];
        result = {name: cardname, amount: amount};
    }

    return result;
}

exports._lineMatchSideboard = (line) => {
    let res = /Sideboard:\s*/;
    let match = res.exec(line);
    return match != null;
};


exports._lineNotMatching = (line) => {
    throw new Error('not matching line: ' + line);
}

exports.traverseCards = (content) => {

    let result = {};
    let initialValue = {};
    let isSideboardActive = false;

    result = content
        .trim()
        .split('\n')
        .reduce((result, line) => {
            result['cards'] = result['cards'] || [];
            result['sideboard'] = result['sideboard'] || [];

            let cardlist;
            cardlist = isSideboardActive ? result['sideboard'] : result['cards']

            matchCard = exports._lineMatchCard(line);
            matchCard != null ? cardlist.push(matchCard) // matching card
            : !isSideboardActive ? isSideboardActive = exports._lineMatchSideboard(line) // Sideboard expressing
            : exports._lineNotMatching(line); // matching error

            return result;
        }, initialValue);
    return result;

};




