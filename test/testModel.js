const Model = require('../src/main/model.js');
const Db = require('../src/main/db.js');
const should = require('chai').should()

describe('model.js', function() {
    beforeEach(function(done) {
        Model.init(':memory:');
        done();
    });

    it('can get sets', (done) => {
        Model.getSets()
        .then((sets) => {
            done();
        });
    });

    it('can get card of set', (done) => {
        rix = {
            code: 'rix',
            card_count: 205,
            search_uri: 'https://api.scryfall.com/cards/search?order=set\u0026q=e%3Arix\u0026unique=prints',
        }
        Model.getCardsOfSet(rix)
        .then((cards) => {
            cards.length.should.be.equal(205);
            done();

        })
    }).timeout(10000);
});
