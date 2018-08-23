import { expect } from 'chai';
import { createSandbox, SinonSandbox, spy } from 'sinon';
import * as fs from 'fs';

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

    before(() => {
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
            decksPath: 'mydecksPath',
            decks: [],
            cards: {},
            deck: {
                deck: {name: 'mydeck', filename: 'mydeck.txt'},
                cards: {},
                sideboard: {},
                cardAmount: {},
            },
            selectedCard: null,
        };

        rootState = {
            umtg: {
                filterColors: [],
                filterString: '',
            }
        };
    });

    after(() => {
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
        expect(state.deck!.cardAmount[card1.id]).to.be.equal(2);
        deckAdjustCardAmount(state.deck!, card1, -1);
        expect(state.deck!.cardAmount[card1.id]).to.be.equal(1);
        deckAdjustCardAmount(state.deck!, card1, -100);
        expect(state.deck!.cardAmount[card1.id]).to.be.equal(0);
    
    });

    it('mutation: removeCardFromSelectedDeck', () => {
        mutations.addCardToSelectedDeck(state, card1);
        expect(Object.keys(state.deck!.cards).length).to.equal(1);
        expect(state.deck!.cardAmount[card1.id]).to.be.equal(1);
        mutations.removeCardFromSelectedDeck(state, card1);
        expect(Object.keys(state.deck!.cards).length).to.equal(1);
        expect(state.deck!.cardAmount[card1.id]).to.be.equal(0);

    }),

    it('mutation: addCardToSelectedDeck', () => {

        
        mutations.addCardToSelectedDeck(state, card1);
        expect(Object.keys(state.deck!.cards).length).to.equal(1);
        expect(state.deck!.cardAmount[card1.id]).to.be.equal(1);
        mutations.addCardToSelectedDeck(state, card1);
        expect(Object.keys(state.deck!.cards).length).to.equal(1);
        expect(state.deck!.cardAmount[card1.id]).to.be.equal(2);
        mutations.addCardToSelectedDeck(state, card2);
        expect(Object.keys(state.deck!.cards).length).to.equal(2);
        expect(state.deck!.cardAmount[card2.id]).to.be.equal(1);
    
    });


    it('action: updateDecks', () => {
        const commit = spy();
        actions.updateDecks({state: state, commit: commit});
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

            expect(commit.args[0][0]).to.be.equal('setDeck');
            let result = commit.args[0][1];
            expect(Object.keys(result.cards).length).to.equal(1);
            //expect(result.cards[result].name).to.equal('Ichor Wellspring');
            //expect(result.cardAmount[result.cards[0].id]).to.be.equal(4);
            expect(Object.keys(result.sideboard).length).to.equal(0);
            done();
        });

    });

    it('action: createDeck', (done) => {
        const commit = spy();
        const openSync = mySandbox.stub(fs, 'openSync').callsFake(() => null);

        actions.createDeck({state, commit}, 'testdeck')
        .then(() => {
            expect(openSync.calledOnce).to.be.true;
            done();
        });
        
    });
    

});
