import { assert, spy, createSandbox, SinonSandbox } from 'sinon';
import { expect } from 'chai';

import { mutations, actions, CollectionState, extendSets } from '../src/renderer/store/modules/collection';
import * as Umtg from '../src/renderer/store/modules/umtg';
import { MagicSet, Card } from '../src/renderer/store/umtgTypes';
import * as Db from '../src/renderer/store/db';
import * as Scryfall from '../src/renderer/store/scryfall';

let state: CollectionState;
let fakeSet: MagicSet;
let fakeSetFiltered: MagicSet;
let fakeCard: Card;

let sandbox: SinonSandbox

describe('store/modules/collection.ts', () => {

    beforeEach(() => {
        sandbox = createSandbox();
        state = {
            loading: false,
            sets: {},
            selectedSet: null,
            cards: {},
            selectedCard: null,
        };
        fakeSet = {
            code: 'ultra',
            set_type: 'ultra'
        },

        fakeSetFiltered = {
            code: 'ignored',
            set_type: 'noUltraSet',
        };

        fakeCard = {
            id: 'UltraId',
            name: 'Ultra Lord'
        };

    });

    afterEach(() => {
        sandbox.restore();
    });

    it('helpers: extendSets()', (done) => {
        let sets = [fakeSet, fakeSetFiltered];
        const getOwnedCardAmountBySetCode = sandbox.stub(Db, 'getOwnedCardAmountBySetCode').resolves(2); 
        const isSetDownloaded = sandbox.stub(Db, 'isSetDownloaded').resolves(true);
        extendSets(sets)
        .then((result) => {
            expect(result['ultra'].ownedCards).to.be.equal(2);
            expect(result['ultra'].downloaded).to.be.true;
            assert.calledTwice(getOwnedCardAmountBySetCode);
            assert.calledTwice(isSetDownloaded);
            done();
        })

    });

    it('mutations: setSets()', () => {
        mutations.setSets(state, {'ultra': fakeSet}); 
        expect(state.sets['ultra']).to.deep.equal(fakeSet);
        expect(state.loading).to.be.false;
    });

    it('mutations: setCards()', () => {
        mutations.setCards(state, {'UltraId': fakeCard}); 
        expect(state.cards['UltraId']).to.deep.equal(fakeCard);
        expect(state.loading).to.be.false;
    });

    it('actions: updateSets() when no set is in db', (done) => {
        const rootState = {
            settings: {
                setTypes: {
                    'ultra': true,
                }
            }
        };
        const commit = spy();
        const getSets = sandbox.stub(Db, 'getSets');
        getSets.onCall(0).resolves([]);
        getSets.onCall(1).resolves([fakeSet]);
        const setAdd = sandbox.stub(Db, 'setAdd').resolves();
        const scryfallGetSets = sandbox.stub(Scryfall, 'scryfallGetSets').resolves({'data': [fakeSet]});
        const getOwnedCardAmountBySetCode = sandbox.stub(Db, 'getOwnedCardAmountBySetCode').resolves(2); 
        const isSetDownloaded = sandbox.stub(Db, 'isSetDownloaded').resolves(true);
        actions.updateSets({state, rootState, commit})
        .then(() => {
            assert.calledTwice(getSets);
            assert.calledOnce(setAdd);
            assert.calledOnce(scryfallGetSets);
            assert.calledOnce(getOwnedCardAmountBySetCode);
            assert.calledOnce(isSetDownloaded);
            expect(commit.getCall(0).args[0]).to.be.equal('setSets');
            expect(commit.getCall(0).args[1]).to.deep.equal({'ultra': fakeSet});
            expect(state.loading).to.be.true;
            done();
        }); 
    });

    it('actions: updateSets() when no set is in db', (done) => {
        const commit = spy();
        const scryfallReqest = sandbox.stub(Scryfall, 'scryfallReqest').resolves([fakeCard])
        const cardAdd = sandbox.stub(Db, 'cardAdd').resolves()
        const getCardsOfSet = sandbox.stub(Db, 'getCardsOfSet').resolves([fakeCard])
        const extendCards = sandbox.stub(Umtg, 'extendCards').resolves({'UltraId': fakeCard})

        actions.selectSet({state, commit}, fakeSet)
            .then((result) => {
                assert.calledOnce(scryfallReqest);
                assert.calledOnce(cardAdd);
                assert.calledOnce(getCardsOfSet);
                assert.calledOnce(extendCards);

                expect(commit.getCall(0).args[0]).to.be.equal('setCards');
                expect(commit.getCall(0).args[1]).to.deep.equal({'UltraId': fakeCard});
                expect(state.loading).to.be.true;
                done();
            })



    });
    
});
