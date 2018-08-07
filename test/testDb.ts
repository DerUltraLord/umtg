import { expect } from 'chai';
import * as assert from 'assert';

import * as Db from '../src/main/db';
import * as testUtils from './testUtils';
import { Card, MagicSet } from '../src/main/umtgTypes';

let testCard : Card = {
    name: 'Ichor Wellspring',
    set: 'ultra',
    id: '1337',
};

let testSet : MagicSet = {
    name: 'Ultra Set',
    code: 'ultra',
    card_count: 10,
};

describe('Test Database', function() {

    beforeEach(() => {
        Db.init(':memory:');
    });


    it('can add cards and check if they are stored in Db', (done) => {
        Db.db.serialize(() => {
            Db.cardAdd(testCard, 0);
            Db.cardExistsByName(testCard.name)
                .then((res) => {
                    expect(res).to.be.true;
                    done()
                });
        });
    });

    it('detect if card is not in db', (done) => {
        Db.cardExistsByName('Name not found')
        .then((res) => { 
            expect(res).to.be.false;
            done()
        });
    });

    it('detect if card is in db by id', (done) => {
        Db.db.serialize(() => {
            Db.cardAdd(testCard, 0);
            let p = Db.cardExistsById('1337');
            p.then((res) => {
                expect(res).to.be.true;
                done();
            });
        });
    });

    it('detect if card is not in db by id', (done) => {
        let p = Db.cardExistsById('1337');
        p.then((res) => {
            expect(res).to.be.false;
            done();
        });
    });

    it('get card by name', (done) => {
        Db.db.serialize(() => {
            Db.cardAdd(testCard, 0);
            let p = Db.getCardByName(testCard.name);
            p.then((res) => {
                expect(res.name).to.be.equal(testCard.name);
                done();
            });
        }); 
    });


    it('add and get all the sets in db', (done) => {
        var myset : MagicSet = {
            code: "ultra",
            name: "ultra lord set",
            set_type: "ultratype",
        }
        var myset2 : MagicSet = {
            code: "foo",
            name: "bar",
            set_type: "othertype",
        }

        var finished = false;

        Db.db.serialize(() => {

            Db.setAdd(myset);
            Db.setAdd(myset2);

            let alltypes = Db.getSets();
            let ultratypes = Db.getSets(["ultratype"]);

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
        Db.db.serialize(() => {
            Db.cardAdd(testCard, 0);
            let p = Db.getCardsOfSet({code: 'ultra'});
            testUtils.assertPromiseResult(p, done, (res) => {
                res[0].name = 'Ichor Wellspring';
            });
        });
    });

    it('cant adjust the card amount if card is not in db', () => {
        testUtils.promiseShouldFail(Db.cardAdjustAmount(testCard, 1));
    });

    it('can adjust the card amount if card is in db', (done) => {
        Db.cardAdd(testCard, 2);
        let p = Db.cardAdjustAmount(testCard, 1);
        testUtils.assertPromiseResult(p, done, (res) => {
            expect(res).to.be.equal(3);
        });
    });

    it('amount of set cards should be -1 if set is not in db', (done) => {
        Db.db.serialize(() => {
            let p = Db.getCardAmountOfSet(testSet);
            testUtils.assertPromiseResult(p, done, (amount) => {
                expect(amount).to.be.equal(-1);
            });
        });

    });

    it('can get card amount of set if set is in db', (done) => {
        Db.db.serialize(() => {
            Db.setAdd(testSet);
            let p = Db.getCardAmountOfSet(testSet);
            testUtils.assertPromiseResult(p, done, (amount) => {
                expect(amount).to.be.equal(10);
            });
        });

    });

    it('can get amount of cards of set are in collection', (done) => {
        Db.db.serialize(() => {
            Db.cardAdd(testCard, 2);
            Db.setAdd(testSet);
            let p = Db.getOwnedCardAmountBySetCode(testSet.code);
            testUtils.assertPromiseResult(p, done, (amount) => {
                expect(amount).to.be.equal(1);
            });
        });

    });

    it('can percentage of set', (done) => {
        Db.db.serialize(() => {
            Db.cardAdd(testCard, 2);
            Db.setAdd(testSet);
            let p = Db.getPercentageOfSet(testSet);
            testUtils.assertPromiseResult(p, done, (amount) => {
                expect(amount).to.be.equal(0.1);
            });

        });
    });

    it('percentage of set returns negative value if not in db', (done) => {
        Db.db.serialize(() => {
            Db.cardAdd(testCard, 2);
            let p = Db.getPercentageOfSet(testSet);
            testUtils.assertPromiseResult(p, done, (amount) => {
                expect(amount).to.be.below(0);
            });

        });
    });

});
