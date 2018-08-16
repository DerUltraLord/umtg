import { assert, createSandbox, SinonSandbox, spy } from 'sinon';
import { expect } from 'chai';

import * as Scryfall from '../src/renderer/store/scryfall';
import * as Db from '../src/renderer/store/db';
import { mutations, actions, SearchState } from '../src/renderer/store/modules/search';
import { Card } from '../src/renderer/store/umtgTypes';

let sandbox: SinonSandbox;
let state: SearchState;
let fakeCard : Card;

describe('store/modules/search.ts', () => {

    beforeEach(() => {
        sandbox = createSandbox();
        state = {
            loading: false,
            cards: {},
            selectedCard: null,
            name: '',
            type: '',
            text: '',
            edition: ''
        };
        fakeCard = {name: 'fakeCard', id: 'fakeid'};
    })

    afterEach(() => {
        sandbox.restore();
    })


    it('mutations: setCards', () => {
        mutations.setCards(state, { 'fakeid': fakeCard });
        expect(state.cards.fakeid).to.be.equal(fakeCard);
        expect(state.loading).to.be.false;
    });

    it('actions: doSearch', () => {
        let fakeResult = {
            data: [fakeCard, ]
        };
        const commit = spy();
        const getSearchFilter = sandbox.stub(Scryfall, 'getSearchFilter').callsFake(() => getSearchFilter);
        const searchByFilter = sandbox.stub(Scryfall, 'searchByFilter').resolves(fakeResult);
        actions.doSearch({state, commit})
        .then(() => {
            commit.calledWith('setCards', fakeResult); 
            assert.calledOnce(getSearchFilter);
            assert.calledOnce(searchByFilter);
            expect(state.loading).to.be.true;
        });


    });
});
