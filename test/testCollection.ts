import { assert, spy, createSandbox, SinonSandbox } from 'sinon';
import { expect } from 'chai';

import * as Collection from '../src/renderer/store/modules/collection';
import * as Umtg from '../src/renderer/store/modules/umtg';
import { MagicSet, Card } from '../src/renderer/store/umtgTypes';
import * as Db from '../src/renderer/store/db';
import * as Scryfall from '../src/renderer/store/scryfall';


let state: Collection.CollectionState;
let fakeSet: MagicSet;
let fakeSetFiltered: MagicSet;
let fakeCard: Card;

let sandbox: SinonSandbox;

describe('store/modules/collection.ts', () => {

    beforeEach(() => {
        sandbox = createSandbox();
        state = {
            loading: false,
            sets: {},
            selectedSet: null,
            cards: {},
            cardIds: [],
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
        Collection.extendSets(sets)
            .then((result) => {
                expect(result['ultra'].collectedAmount).to.be.equal(2);
                expect(result['ultra'].downloaded).to.be.true;
                assert.calledTwice(getOwnedCardAmountBySetCode);
                assert.calledTwice(isSetDownloaded);
                done();
            });

    });
    it('helpers: adjustCardAmountOfCollection()', (done) => {
        const cardAdd = sandbox.stub(Db, 'cardAdd').callsFake(() => null);
        const cardExistsById = sandbox.stub(Db, 'cardExistsById').resolves(false);
        Collection.adjustCardAmountOfCollection(state, fakeCard, 2)
            .then((amount) => {
                expect(cardAdd.calledOnce).to.be.true;        
                expect(cardExistsById.calledOnce).to.be.true;        

                expect(amount).to.be.equal(2);
                done();
            });
    });

    it('mutations: setSets()', () => {
        Collection.mutations.setSets(state, {'ultra': fakeSet}); 
        expect(state.sets['ultra']).to.deep.equal(fakeSet);
    });

    it('mutations: setOwnedAmountOfCard()', () => {
        state.cards[fakeCard.id] = fakeCard;
        state.cards[fakeCard.id].ownedAmount = 0;
        Collection.mutations.setOwnedAmountOfCard(state, {card: fakeCard, amount: 2}); 
        expect(state.cards[fakeCard.id].ownedAmount).to.be.equal(2);
    });

    it('mutations: setCollectedAmountBySetCode()', () => {
        state.sets[fakeSet.code] = fakeSet;
        Collection.mutations.setCollectedAmountBySetCode(state, {setCode: fakeSet.code, amount: 4});
        expect(state.sets[fakeSet.code].collectedAmount).to.be.equal(4);
    });

    it('mutations: setCards()', () => {
        Collection.mutations.setCards(state, {'UltraId': fakeCard}); 
        expect(state.cards['UltraId']).to.deep.equal(fakeCard);
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
        Collection.actions.updateSets({state, rootState, commit})
        .then(() => {
            assert.calledTwice(getSets);
            assert.calledOnce(setAdd);
            assert.calledOnce(scryfallGetSets);
            assert.calledOnce(getOwnedCardAmountBySetCode);
            assert.calledOnce(isSetDownloaded);
            expect(commit.getCall(0).args[0]).to.be.equal('setSets');
            expect(commit.getCall(0).args[1]).to.deep.equal({'ultra': fakeSet});
            done();
        }); 
    });

    it('actions: updateSets() when no set is in db', (done) => {
        const commit = spy();
        const scryfallReqest = sandbox.stub(Scryfall, 'scryfallReqest').resolves([fakeCard]);
        const cardAdd = sandbox.stub(Db, 'cardAdd').callsFake(() => null);
        const getCardsOfSet = sandbox.stub(Db, 'getCardsOfSet').resolves([fakeCard]);
        const extendCards = sandbox.stub(Umtg, 'extendCards').resolves({'UltraId': fakeCard});

        Collection.actions.selectSet({state, commit}, fakeSet)
            .then((result) => {
                assert.calledOnce(scryfallReqest);
                assert.calledOnce(cardAdd);
                assert.calledOnce(getCardsOfSet);
                assert.calledOnce(extendCards);

                expect(commit.getCall(0).args[0]).to.be.equal('setCards');
                expect(commit.getCall(0).args[1]).to.deep.equal({'UltraId': fakeCard});
                done();
            });
    });

    it('actions: addCardToCollection/removeCardFromCollection', (done) => {
        const commit = spy();
        const adjustCardAmountOfCollection = sandbox.stub(Collection, 'adjustCardAmountOfCollection');
        adjustCardAmountOfCollection.onCall(0).resolves(2);
        adjustCardAmountOfCollection.onCall(1).resolves(1);
        Collection.actions.addCardToCollection({state, commit}, fakeCard)
            .then(() => {
                expect(adjustCardAmountOfCollection.calledOnce).to.be.true;
                expect(commit.calledOnce).to.be.true;

                expect(commit.getCall(0).args[0]).to.be.equal('setOwnedAmountOfCard');
                expect(commit.getCall(0).args[1].amount).to.be.equal(2);
                return Collection.actions.removeCardFromCollection({state, commit}, fakeCard);
            })
            .then(() => {
                expect(adjustCardAmountOfCollection.calledTwice).to.be.true;
                expect(commit.calledTwice).to.be.true;
                expect(commit.getCall(1).args[0]).to.be.equal('setOwnedAmountOfCard');
                expect(commit.getCall(1).args[1].amount).to.be.equal(1);
                done();
            });
    });

    it('actions: addCardToCollection/removeCardFromCollection', (done) => {
        const commit = spy();
        const getOwnedCardAmountBySetCode = sandbox.stub(Db, 'getOwnedCardAmountBySetCode').resolves(1337);
        Collection.actions.updateCollectedAmountBySetCode({state, commit}, fakeSet.code)
            .then(() => {
                expect(commit.calledOnce).to.be.true;

                expect(commit.getCall(0).args[0]).to.be.equal('setCollectedAmountBySetCode');
                expect(commit.getCall(0).args[1].amount).to.be.equal(1337);
                done();
            });
    });
    
    
});
