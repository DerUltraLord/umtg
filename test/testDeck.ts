import { expect } from 'chai';
import { createSandbox, SinonSandbox, spy } from 'sinon';
import * as fs from 'fs';

import _, { state, mutations, actions, lineMatchCard, lineMatchSideboard, DeckState } from '../src/renderer/store/modules/deck';
import { Card, DecklistCard } from '../src/renderer/store/umtgTypes';
import * as db from '../src/renderer/store/db';

let mySandbox: SinonSandbox;
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

    it('mutation: addCardToDeck', () => {

        let stateMock: DeckState = {
            decksPath: 'mydecksPath',
            decks: [],
            deck: {
                deck: {name: 'mydeck', filename: 'mydeck.txt'},
                cards: [],
                sideboard: [],
                cardAmount: {},
            }
        };
        
        let myCard: Card = {
            name: 'UltraLord',
            id: 'UltraId'
        };
    
        let otherCard: Card = {
            name: 'OtherCard',
            id: 'OtherCard'
        };
    
        mutations.addCardToDeck(stateMock, myCard);
        expect(stateMock.deck!.cards.length).to.equal(1);
        expect(stateMock.deck!.cardAmount[myCard.id]).to.be.equal(1);
        mutations.addCardToDeck(stateMock, myCard);
        expect(stateMock.deck!.cards.length).to.equal(1);
        expect(stateMock.deck!.cardAmount[myCard.id]).to.be.equal(2);
        mutations.addCardToDeck(stateMock, otherCard);
        expect(stateMock.deck!.cards.length).to.equal(2);
        expect(stateMock.deck!.cardAmount[otherCard.id]).to.be.equal(1);
    
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
        let myDeck = {
            name: 'foo',
            filename: 'filename.txt'
        };
        actions.selectDeck({state: state, commit: commit, payload: myDeck})
        .then(() => {

            expect(commit.args[0][0]).to.be.equal('setDeck');
            let result = commit.args[0][1];
            expect(result.cards.length).to.equal(1);
            expect(result.cards[0].name).to.equal('Ichor Wellspring');
            expect(result.sideboard.length).to.equal(0);
            done();
        });

    });
    

});
