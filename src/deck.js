var fs = require('fs');
var db = require('./db.js');
var scry = require('./scryfall.js');


class Deck {
    constructor(name) {
        this.name = name;
    }
}


exports.getDecks = function(callback) {
    fs.readdir('/home/maximilian/Downloads/decks/', function(err, files) {
        var res = [];
        files.forEach(file => {
            res.push(new Deck(file));
        })
        callback(res);
    });
}

exports.getCardsOfDeck = function(deckname, callback) {
    fs.readFile("/home/maximilian/Downloads/decks/" + deckname, 'ascii', function(err, data) {
        var addedIds = [];
        data.split('\n').forEach(line => {
            var re = /(\d+)\s(.*)/;
            var match = re.exec(line);
            if (match) {
                var cardname = match[2];
                db.cardExistsByName(cardname, function(exists) {
                    if (exists == false) {
                        scry.getCardByName(cardname, function(card) {
                            if (addedIds.indexOf(card.id, addedIds) == -1) {
                                db.cardAdd(card, 0);
                                addedIds.push(card.id);
                                callback(card);
                            }
                        });
                    } else {
                        db.getCardByName(cardname, function(card) {
                            callback(card);
                        });
                    }
                });
            } else {
                //console.log("not matching " + line);
            }

        });
    })
}
