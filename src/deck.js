fs = require('fs');


class Deck {
    constructor(name) {
        this.name = name;
    }
}

function DECK () {
}


DECK.getDecks = function(callback) {
    fs.readdir('/home/maximilian/Downloads/decks/', function(err, files) {
        var res = [];
        files.forEach(file => {
            res.push(new Deck(file));
        })
        callback(res);
    });
}

DECK.getCardsOfDeck = function(deckname, callback) {
    fs.readFile("/home/maximilian/Downloads/decks/" + deckname, 'ascii', function(err, data) {
        var addedIds = [];
        data.split('\n').forEach(line => {
            var re = /(\d+)\s(.*)/;
            var match = re.exec(line);
            if (match) {
                //console.log(DB.cardInDbByName(match[2]));
                var cardname = match[2];
                DB.cardExistsByName(cardname, function(exists) {
                    console.log(exists);
                    if (exists == false) {
                        SCRYFALL.getCardByName(cardname, function(card) {
                            if ($.inArray(card.id, addedIds) == -1) {
                                DB.cardAdd(card, 0);
                                addedIds.push(card.id);
                                callback(card);
                            }
                        });
                    } else {
                        DB.getCardByName(cardname, function(card) {
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
