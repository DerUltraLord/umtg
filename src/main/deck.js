var db = require("./db.js");
var scry = require("./scryfall.js");
var decksPath = process.env.HOME + "/.umtg/decks";
const fs = require('fs');
const base = require('./base.js');


exports.getDecks = function() {
    return fs.readdirSync(decksPath);
};

exports.getCardsOfDeck = async deckname => {
    let contents = await base.readFile(decksPath + "/" + deckname);
    let deckResult = exports.traverseCards(contents);

    cards = await exports.getCardObjectsFromCardNames(deckResult.cards);
    sideboard = await exports.getCardObjectsFromCardNames(deckResult.sideboard);

    return {
        cards: cards,
        sideboard: sideboard,
    }
};

exports.getCardObjectsFromCardNames = cards => {
    let addedIds = [];
    return cards.reduce(async (p, card) => {
        let data = await p;
        let exists = await db.cardExistsByName(card.name);
        let dbCard = null;
        if (exists) {
            dbCard = await db.getCardByName(card.name);
        } else {
            dbCard = await scry.getCardByName(card.name);
            if (addedIds.indexOf(dbCard.id) == -1) {
                db.cardAdd(dbCard, 0);
                addedIds.push(dbCard.id);
            }
        }
        dbCard['amount'] = Number(card.amount);
        data.push(dbCard);
        return Promise.resolve(data);
    }, Promise.resolve([]));
};

exports.addCardToDeck = function(deck, card) {

    let decknames = exports.getDecks();
    if (decknames.includes(deck)) {
        return exports.getCardsOfDeck(deck)
        .then((deck) => {
            deck.cards.push(card);
            return deck;
        });
        
    } else {
        throw new Error("Deck " + deck + " not found");
    }


};

exports._lineMatchCard = line => {
    let regexResult = base.matchRegex(/(\d+)\s(.*)/)(line);
    let res = null;
    if (regexResult) {
        res = {
            amount: Number(regexResult[1]),
            name: regexResult[2],
        }
    }
    return res;
};

exports._lineMatchSideboard = line => 
    base.matchRegex(/Sideboard:\s*/)(line)


exports._lineNotMatching = (line) => {
    //throw new Error("not matching line: " + line);
};

exports.traverseCards = (content) => {

    let result = {};
    let initialValue = {};
    let isSideboardActive = false;

    result = content
        .trim()
        .split("\n")
        .reduce((result, line) => {
            result["cards"] = result["cards"] || [];
            result["sideboard"] = result["sideboard"] || [];

            let cardlist;
            cardlist = isSideboardActive ? result["sideboard"] : result["cards"];

            let cardResult = exports._lineMatchCard(line);
            let sideboardResult = exports._lineMatchSideboard(line);

            if (sideboardResult) {
                isSideboardActive = true;
            } else {
                if (cardResult) {
                    cardlist.push(cardResult);
                } else {
                    exports._lineNotMatching(line);
                }
            }

            return result;
        }, initialValue);
    return result;

};

exports.createDeck = (deckname) => {
    fs.openSync(decksPath + "/" + deckname + '.txt', 'w', (err, file) => {
        if (err) throw err;
    });
}




