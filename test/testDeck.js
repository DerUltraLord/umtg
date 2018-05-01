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



});
