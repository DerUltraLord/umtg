var assert = require('assert');
var deck = require('../src/deck.js');
var db = require('../src/db.js');
var sinon = require('sinon');
var fs = require('fs');

describe('deck.js', function() {
    var sandbox;

    beforeEach(function(done) {
        sandbox = sinon.sandbox.create();
        sandbox.stub(fs, 'readdir').callsFake(function(path, callback) {
            callback(null, ['test1.txt', 'test2.txt']);
        });
        sandbox.stub(fs, 'readFile').callsFake(function(path, encoding, callback) {
            callback(null, '4 Ichor Wellspring');
        });
        db.init(':memory:');
        done();
    });

    afterEach(function(done) {
        sandbox.restore();
        done();
    });

    it('getDecks()', function() {
        deck.getDecks(function(res) {
            assert.equal(res[0].name, 'test1.txt');
            assert.equal(res[1].name, 'test2.txt');
        });
    });

    it('getCardsOfDeck()', function() {

        deck.getCardsOfDeck('test1.txt', function(card) {
        });

    });

    it('_lineMatchSideboard()', function() {
        assert.equal(deck._lineMatchSideboard("Sideboard: "), true);
        assert.equal(deck._lineMatchSideboard("Sideboard:"), true);
        assert.equal(deck._lineMatchSideboard("Sideboard"), false);
    });

    it('_lineMatchSideboard()', function() {
        let result = deck._lineMatchCard("4 Ichor Wellspring");
        assert.equal(result.name, "Ichor Wellspring");
        assert.equal(result.amount, 4);

        result = deck._lineMatchCard("4Ichor Wellspring");
        assert.equal(result, null);
    });


    it('traverseCards() without sideboard', function() {
        let content = "4 Ichor Wellspring\n2 Lightning bolt";

        let result = deck.traverseCards(content);
        cards = result.cards;
        assert.equal(cards.length, 2);
        assert.equal(cards[0].name, 'Ichor Wellspring');
        assert.equal(cards[0].amount, 4);

        assert.equal(result.sideboard.length, 0);

    });

    it('traverseCards() with sideboard', function() {
        // TODO: how to handle double entries
        let content = "4 Ichor Wellspring\n2 Lightning bolt\nSideboard: \n2 Lightning bolt";

        let result = deck.traverseCards(content);
        cards = result.cards;
        assert.equal(cards.length, 2);
        assert.equal(cards[0].name, 'Ichor Wellspring');
        assert.equal(cards[0].amount, 4);
        assert.equal(cards[1].name, 'Lightning bolt');
        assert.equal(cards[1].amount, 2);

        assert.equal(result.sideboard.length, 1);
        assert.equal(result.sideboard[0].name, 'Lightning bolt');
        assert.equal(result.sideboard[0].amount, 2);

    });

});
