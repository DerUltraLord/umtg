import { createSandbox, SinonSandbox } from 'sinon';
import { expect } from 'chai';

import { updateCards } from '../src/renderer/store/modules/umtg';
import * as Db from '../src/renderer/store/db';

let sandbox: SinonSandbox;

describe('store/modules/umtg.ts', () => {


    beforeEach(() => {
        sandbox = createSandbox();
    });

    afterEach(() => sandbox.restore);

    it('helper: updateCards', (done) => {
        let cards = [
            {
                id: 'ultraid',
                name: 'Ultra Lord',
            }
        ]

        const getAmountOfCardById = sandbox.stub(Db, 'getAmountOfCardById').resolves(1);
        updateCards(cards)
            .then((result) => {
                expect(result.ultraid.ownedAmount).to.be.equal(1);
                done();
            });

    });

});
