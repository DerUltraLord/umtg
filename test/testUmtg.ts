import { createSandbox, SinonSandbox } from 'sinon';
import { expect } from 'chai';

import { extendCards, filterCards } from '../src/renderer/store/modules/umtg';
import { Dict, Card } from '../src/renderer/store/umtgTypes';
import * as Db from '../src/renderer/store/db';

let sandbox: SinonSandbox;

describe('store/modules/umtg.ts', () => {


    beforeEach(() => {
        sandbox = createSandbox();
    });

    afterEach(() => sandbox.restore);

    it('helper: extendCards', (done) => {
        let cards = [
            {
                id: 'ultraid',
                name: 'Ultra Lord',
            }
        ];

        const getAmountOfCardById = sandbox.stub(Db, 'getAmountOfCardById').resolves(1);
        extendCards(cards)
            .then((result) => {
                expect(result.ultraid.ownedAmount).to.be.equal(1);
                done();
            });

    });

    it('helper: filterCards', () => {

        let cards = {
            'ultraid': {
                'id': 'ultraid',
                'name': 'Ultra Lord',
                'colors': ['B']
            },
            'otherCard': {
                'id': 'otherCard',
                'name': 'otherCard',
                'colors': ['U']
            },
            'otherCard2': {
                'id': 'otherCard2',
                'name': 'otherCard',
                'colors': ['R']
            },
            'otherCard3': {
                'id': 'otherCard3',
                'name': 'otherCard',
                'colors': []
            }
        };

        let result = filterCards(cards, ['B', 'U'], '');
        expect(Object.keys(result).length).to.be.equal(2);
        expect(result['ultraid'].id).to.be.equal('ultraid');
        result = filterCards(cards, ['R'], 'otherc');
        expect(Object.keys(result).length).to.be.equal(1);
        expect(result['otherCard2'].id).to.be.equal('otherCard2');
        result = filterCards(cards, [], 'otherc');
        expect(Object.keys(result).length).to.be.equal(1);
        expect(result['otherCard3'].id).to.be.equal('otherCard3');

    });

});
