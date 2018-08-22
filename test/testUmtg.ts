import { createSandbox, SinonSandbox } from 'sinon';
import { expect } from 'chai';

import { extendCards } from '../src/renderer/store/modules/umtg';
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

});
