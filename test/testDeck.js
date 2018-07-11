var assert = require('assert');
var deck = require('../src/main/deck.js');
var db = require('../src/main/db.js');
var sinon = require('sinon');
var fs = require('fs');
const testUtils = require('./testUtils.js');
const should = require('chai').should();

describe('Test Deck management and parsing', function() {

    before(() => {
        testUtils.mockFileRead("4 Ichor Wellspring\nSideboard:\n2 Ultra Lord")
        testUtils.mockReadDir(["deck1.txt", "deck2.txt"]);
        testUtils.mockGetJson([{name: 'Ultra Lord', set: 'ultra'}]);
        testUtils.sandbox.stub(deck, 'getCardObjectsFromCardNames').callsFake((cards) => Promise.resolve(cards));
    });

    after(() => testUtils.shutdown());

    it('get a list of all deck filenames', (done) => {
        deck.getDecks()
        .then((decks) => {
            assert.equal(decks[0], 'deck1.txt');
            assert.equal(decks[1], 'deck2.txt');
            done();
        })
        .catch(console.error);
    });

    it('parsing Sideboard line for matches and missmatches', function() {
        deck._lineMatchSideboard("Sideboard: ").should.not.be.null;
        deck._lineMatchSideboard("Sideboard:").should.not.be.null;
        should.equal(deck._lineMatchSideboard("Sideboard"), null);
    });

    it('parsing Card definitions', () => {
        let res = deck._lineMatchCard("4 Ichor Wellspring");
        res.name.should.equal('Ichor Wellspring');
        res.amount.should.equal(4);
        res = deck._lineMatchCard("4Ichor Wellspring");
        should.equal(res, null);
    });

    it('parse decklist without sideboard', () => {
        let content = "4 Ichor Wellspring\n2 Lightning bolt";
        let result = deck.traverseCards(content);

    });

    it('parse decklist with sideboard', () => {

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

    it('get all cards of a deck', (done) => {

        let p = deck.getCardsOfDeck('mydeck');
        testUtils.assertPromiseResult(p, done, (deck) => {
            deck.cards[0].amount.should.be.equal(4);
            deck.cards[0].name.should.be.equal('Ichor Wellspring');
            deck.sideboard[0].amount.should.be.equal(2);
            deck.sideboard[0].name.should.be.equal('Ultra Lord');
        });
    });

    it('go over a card list check if card is in db; if not save it into db;\nreturn the json card objects', (done) => {
        let p = deck.getCardObjectsFromCardNames([{name: 'Ultra Lord',amount: 1}]);
        testUtils.assertPromiseResult(p, done, (cards) => {
            cards[0].name.should.be.equal('Ultra Lord');
        });

    });

    //it('addCardToDeck()', () => {
    //    card = {
    //        name: "Ichor Wellspring",
    //    };

    //    deck.addCardToDeck("test1.txt", card);
    //});

});
