import * as Model from '../src/main/model';
import * as Settings from '../src/main/settings';
import * as TestUtils from './testUtils';
import * as Db from '../src/main/db';
import { expect }  from 'chai';

describe('model.js', function() {
    beforeEach(function(done) {
        TestUtils.mockToDoNothing(Settings, 'init');
        Model.init(':memory:');
        done();
    });

    afterEach(() => TestUtils.shutdown());

    it('can get sets', (done) => {
        Model.updateSets()
        .then((sets) => {
            done();
        });
    });

    it('can get card of set', (done) => {
        let rix = {
            code: 'rix',
            card_count: 205,
            search_uri: 'https://api.scryfall.com/cards/search?order=set\u0026q=e%3Arix\u0026unique=prints',
        }
        Model.getCardsOfSet(rix)
        .then((cards) => {
            expect(cards.length).to.be.equal(205);
            done();

        })
    }).timeout(10000);
});
