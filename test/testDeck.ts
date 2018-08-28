import { expect } from 'chai';
import { createSandbox, SinonSandbox, spy } from 'sinon';
import fs from 'fs';

import _, { mutations, actions, deckAdjustCardAmount, lineMatchCard, lineMatchSideboard, DeckState } from '../src/renderer/store/modules/deck';
import { Deck, Card, DecklistCard } from '../src/renderer/store/umtgTypes';
import * as db from '../src/renderer/store/db';

let mySandbox: SinonSandbox;
let state: DeckState;

let card1: Card = {
    name: 'UltraLord',
    id: 'UltraId'
};

let card2: Card = {
    name: 'OtherCard',
    id: 'OtherCard'
};

let rootState: any;
    

describe('store/modules/deck.ts for DeckManagement', () => {

    beforeEach(() => {
        mySandbox = createSandbox();
        mySandbox.stub(fs, 'readdirSync').callsFake(() => ['deck1.txt', 'deck2.txt']);
        mySandbox.stub(fs, 'readFileSync').callsFake(() => '4 Ichor Wellspring');
        mySandbox.stub(db, 'getCardByName').callsFake((cardname: string) => {
            let result: Card = {
                id: cardname,
                name: cardname
            };
            return result;
        });
        mySandbox.stub(db, 'cardExistsByName').callsFake((cardname: string) => true);

        state = {
            loading: false,
            decks: [],
            cards: {},
            cardIds: [],
            deck: {
                deck: {name: 'mydeck', filename: 'mydeck.txt'},
                decklist: {
                    cards: [],
                    sideboard: []
                }
            },
            selectedCard: null,
        };

        rootState = {
            umtg: {
                filterColors: [],
                filterString: '',
            },
            settings: {
                settingsPath: 'settingsPath',
                decksFolder: 'decksFolder'
            }
        };
    });

    afterEach(() => {
        mySandbox.restore() ;
    });

    
    it('helper: lineMatchCard', () => {
        let res: DecklistCard | null = lineMatchCard('4 Ichor Wellspring');
        expect(res).to.not.equal(null);
        if (res !== null) {
            expect(res.amount).to.equal(4);
            expect(res.name).to.equal('Ichor Wellspring');
        }

    });
    
    it('helper: lineMatchSideboard', () => {
    
        expect(lineMatchSideboard('4 Ichor Wellspring')).to.be.false;
        expect(lineMatchSideboard('Sideboard:')).to.be.true;
    });

    it('helper: deckAdjustCardAmount', () => {
        deckAdjustCardAmount(state.deck!, card1, 2);
        expect(state.deck!.decklist.cards[0].amount).to.be.equal(2);
        deckAdjustCardAmount(state.deck!, card1, -1);
        expect(state.deck!.decklist.cards[0].amount).to.be.equal(1);
        deckAdjustCardAmount(state.deck!, card1, -100);
        expect(state.deck!.decklist.cards[0].amount).to.be.equal(0);
    
    });

    it('mutation: removeCardFromSelectedDeck', () => {
        mutations.addCardToSelectedDeck(state, card1);
        expect(state.deck!.decklist.cards.length).to.equal(1);
        expect(state.deck!.decklist.cards[0].amount).to.be.equal(1);
        mutations.removeCardFromSelectedDeck(state, card1);
        expect(state.deck!.decklist.cards.length).to.equal(1);
        expect(state.deck!.decklist.cards[0].amount).to.be.equal(0);

    }),

    it('mutation: addCardToSelectedDeck', () => {

        
        mutations.addCardToSelectedDeck(state, card1);
        expect(state.deck!.decklist.cards.length).to.equal(1);
        expect(state.deck!.decklist.cards[0].amount).to.be.equal(1);
        mutations.addCardToSelectedDeck(state, card1);
        expect(state.deck!.decklist.cards.length).to.equal(1);
        expect(state.deck!.decklist.cards[0].amount).to.be.equal(2);
        mutations.addCardToSelectedDeck(state, card2);
        expect(state.deck!.decklist.cards.length).to.equal(2);
        expect(state.deck!.decklist.cards[1].amount).to.be.equal(1);
    
    });


    it('action: updateDecks', () => {
        const commit = spy();
        const rootState = {
            settings: {
                settingsPath: 'settigns',
                decksFolder: 'decks'
            }
        };
        actions.updateDecks({state: state, commit: commit, rootState: rootState});
        expect(commit.args[0][0]).to.be.equal('setDecks');
        const decklist = commit.args[0][1];
        expect(decklist[0].name).to.equal('deck1');
        expect(decklist[0].filename).to.equal('deck1.txt');
        expect(decklist[1].name).to.equal('deck2');
        expect(decklist[1].filename).to.equal('deck2.txt');
    });
    
    it('action: selectDeck', (done) => {
        const commit = spy();
        let myDeck: Deck = {
            name: 'foo',
            filename: 'filename.txt'
        };
        actions.selectDeck({state, commit, rootState}, myDeck)
        .then(() => {

            expect(commit.getCall(0).args[0]).to.be.equal('setDeck');
            done();
        });

    });

    it('action: createDeck', (done) => {
        const commit = spy();
        const openSync = mySandbox.stub(fs, 'openSync').callsFake(() => null);

        actions.createDeck({state, commit, rootState}, 'testdeck')
        .then(() => {
            expect(openSync.calledOnce).to.be.true;
            done();
        });
        
    });
    

});
