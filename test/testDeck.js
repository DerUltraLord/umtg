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
        testUtils.mockGetJson([{name: 'Ultra Lord', set: 'ultra'}]);
        testUtils.sandbox.stub(deck, 'getCardObjectsFromCardNames').callsFake((cards) => Promise.resolve(cards));
        testUtils.sandbox.stub(fs, 'readdirSync').callsFake((decksPath) => ["deck1.txt", "deck2.txt"]);
    });

    after(() => testUtils.shutdown());

    it('get a list of all deck filenames', () => {
        let decks = deck.getDecks()
        assert.equal(decks[0], 'deck1.txt');
        assert.equal(decks[1], 'deck2.txt');
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

    it('can save a deck to disk', () => {
        let myStub = testUtils.sandbox.stub(fs, 'writeFileSync');
        let writeFileMock = (file, data, mode) => {
            file.should.be.equal(process.env.HOME + '/.umtg/decks/mydeck.txt');
            let expectedData = `4 Ichor Wellspring
`;
            data.should.be.equal(expectedData);
            
        };
        myStub.callsFake(writeFileMock);
        let myDeck = {
            cards: [
                {
                    name: 'Ichor Wellspring',
                    amount: 4,
                }
            ]
        };
        deck.saveDeckToDisk('mydeck.txt', myDeck); 

    });

    it('add new card to deck', (done) => {
        card = {
            name: "A new Card",
        };
        p = deck.addCardToDeck("deck1.txt", card);
        testUtils.assertPromiseResult(p, done, (deck) => {
            deck.cards[1].name.should.be.equal('A new Card');
            deck.cards[1].amount.should.be.equal(1);
        });
    });

    it('add card which is already in deck', (done) => {
        card = {
            name: "Ichor Wellspring",
        };
        p = deck.addCardToDeck("deck1.txt", card);
        testUtils.assertPromiseResult(p, done, (deck) => {
            deck.cards[0].name.should.be.equal('Ichor Wellspring');
            deck.cards[0].amount.should.be.equal(5);
        });
    });


});
