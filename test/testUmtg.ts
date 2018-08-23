import { createSandbox, SinonSandbox } from 'sinon';
import { expect } from 'chai';

import { extendCards, filterCards, sortCards } from '../src/renderer/store/modules/umtg';
import { Dict, Card } from '../src/renderer/store/umtgTypes';
import * as Db from '../src/renderer/store/db';

let sandbox: SinonSandbox;
let cards: any;

describe('store/modules/umtg.ts', () => {


    beforeEach(() => {
        sandbox = createSandbox();
        cards = {
            'ultraid': {
                'id': 'ultraid',
                'name': 'Ultra Lord',
                'colors': ['B'],
                'cmc': 2
            },
            'otherCard': {
                'id': 'otherCard',
                'name': 'otherCard',
                'colors': ['U'],
                'cmc': 1
            },
            'otherCard2': {
                'id': 'otherCard2',
                'name': 'otherCard',
                'colors': ['R']
            },
            'otherCard3': {
                'id': 'otherCard3',
                'name': 'otherCard',
                'colors': ['C']
            }
        };
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


        let result = filterCards(cards, ['B', 'U'], '');
        expect(Object.keys(result).length).to.be.equal(2);
        expect(result[0]).to.be.equal('ultraid');
        result = filterCards(cards, ['R'], 'otherc');
        expect(Object.keys(result).length).to.be.equal(1);
        expect(result[0]).to.be.equal('otherCard2');
        result = filterCards(cards, ['C'], 'otherc');
        expect(Object.keys(result).length).to.be.equal(1);
        expect(result[0]).to.be.equal('otherCard3');

    });

    it('helper: sortCards', () => {
        let result = sortCards(cards, [], 'cmc');
        expect(result.length).to.be.equal(0);
        result = sortCards(cards, ['ultraid', 'otherCard'], 'cmc');
        expect(result.length).to.be.equal(2);
        expect(result[0]).to.be.equal('otherCard');

    });

});
