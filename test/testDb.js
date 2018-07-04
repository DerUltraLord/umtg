var assert = require('assert');
var db = require('../src/db.js');
const testUtils = require('./testUtils.js');
var mydb = null;

let testCard = {
    name: 'Ichor Wellspring',
    set: 'ultra',
    id: '1337',
};

describe('Test Database', function() {

    beforeEach(function(done) {
        db.init(':memory:');
        done();
    });


    it('can add cards and check if they are stored in db', (done) => {
        let cardname = 'Ichor Wellspring';
        db.cardAdd({name: cardname}, 0);
        db.cardExistsByName(cardname)
        .then((res) => {
            res.should.be.true;
            done()
        });
    });

    it('detect if card is not in db', (done) => {
        db.cardExistsByName('Name not found')
        .then((res) => { 
            res.should.be.false;
            done()
        });
    });

    it('detect if card is in db by id', (done) => {
        db.cardAdd(testCard, 0);
        let p = db.cardExistsById('1337');
        testUtils.assertPromiseResult(p, done, (res) => {
            res.should.be.true;
        });
    });

    it('detect if card is not in db by id', (done) => {
        let p = db.cardExistsById('1337');
        testUtils.assertPromiseResult(p, done, (res) => {
            res.should.be.false;
        });
    });

    it('get card by name', (done) => {
        let cardname = 'Ichor Wellspring';
        db.cardAdd({name: cardname}, 0);
        let p = db.getCardByName(cardname);
        testUtils.assertPromiseResult(p, done, (res) => {
            res.name.should.be.equal(cardname);
        });
    });


    it('add and get all the sets in db', (done) => {
        var myset = {
            code: "ultra",
            name: "ultra lord set",
            set_type: "ultratype",
        }
        var myset2 = {
            code: "foo",
            name: "bar",
            set_type: "othertype",
        }

        var finished = false;

        db.db.serialize(() => {

            db.setAdd(myset);
            db.setAdd(myset2);

            let alltypes = db.getSets();
            let ultratypes = db.getSets(["ultratype"]);

            Promise.all([alltypes, ultratypes])
            .then(values => {
                // alltypes
                let res = values[0];
                assert.equal(res.length, 2);
                let set = res[0];
                assert.equal(set.code, "ultra");
                assert.equal(set.name, "ultra lord set");
                assert.equal(set.set_type, "ultratype");
                set = res[1];
                assert.equal(set.code, "foo");
                assert.equal(set.name, "bar");
                assert.equal(set.set_type, "othertype");

                // ultratypes
                res = values[1];
                assert.equal(res.length, 1);
                done();
            })
            .catch(done);
        });
    });

    it('can get all the cards of a specific set', (done) => {
        db.db.serialize(() => {
            db.cardAdd(testCard, 0);
            let p = db.getCardsOfSet({code: 'ultra'});
            testUtils.assertPromiseResult(p, done, (res) => {
                res[0].name = 'Ichor Wellspring';
            });
        });
    });

    it('cant adjust the card amount if card is not in db', () => {
        testUtils.promiseShouldFail(db.cardAdjustAmount(testCard, 1));
    });

    it('can adjust the card amount if card is in db', (done) => {
        db.cardAdd(testCard, 2);
        let p = db.cardAdjustAmount(testCard, 1);
        testUtils.assertPromiseResult(p, done, (res) => {
            res.should.be.equal(3);
        });
    });

});
