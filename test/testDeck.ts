import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';
import * as fs from 'fs';

import * as testUtils from './testUtils';
import { getDecks, getCardsOfDeck, lineMatchCard, lineMatchSideboard, addCardToDeck } from '../src/main/deck';
import { Deck, Card, DecklistCard, DeckWithCards } from '../src/main/umtgTypes';
import * as db from '../src/main/db';

let mySandbox: SinonSandbox;

let testDeck: Deck = {
    filename: 'foo.txt',
    name: 'foo',
};

describe('Deck Management Module', () => {

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

    it('should provide a list with all decks', () => {
        let res: Deck[] = getDecks();
        expect(res[0].name).to.equal('deck1');
        expect(res[0].filename).to.equal('deck1.txt');
        expect(res[1].name).to.equal('deck2');
        expect(res[1].filename).to.equal('deck2.txt');
    });

    it('should provide all cards of a specific deck', (done) => {
        let myDeck: Deck = {
            name: 'foo',
            filename: 'filename.txt'
        };
        let p: Promise<DeckWithCards> = getCardsOfDeck(myDeck);
        testUtils.assertPromiseResult(p, done, (result: DeckWithCards) => {
            expect(result.cards.length).to.equal(1);
            expect(result.cards[0].name).to.equal('Ichor Wellspring');
            expect(result.sideboard.length).to.equal(0);
        });
    });

    it('should read card definitions from a decklist', () => {
        let res: DecklistCard | null = lineMatchCard('4 Ichor Wellspring');
        expect(res).to.not.equal(null);
        if (res !== null) {
            expect(res.amount).to.equal(4);
            expect(res.name).to.equal('Ichor Wellspring');
        }

    });

    it('should read the sideboard definition from a decklist', () => {

        expect(lineMatchSideboard('4 Ichor Wellspring')).to.be.false;
        expect(lineMatchSideboard('Sideboard:')).to.be.true;
    });

    it('add card to deck', () => {
        let myDeck: DeckWithCards = {
            deck: testDeck,
            cards: [],
            sideboard: [],
            cardAmount: {},
        };

        let myCard: Card = {
            name: 'UltraLord',
            id: 'UltraId'
        };

        let otherCard: Card = {
            name: 'OtherCard',
            id: 'OtherCard'
        };

        addCardToDeck(myDeck, myCard);
        expect(myDeck.cards.length).to.equal(1);
        expect(myDeck.cardAmount[myCard.id]).to.be.equal(1);
        addCardToDeck(myDeck, myCard);
        expect(myDeck.cards.length).to.equal(1);
        expect(myDeck.cardAmount[myCard.id]).to.be.equal(2);
        addCardToDeck(myDeck, otherCard);
        expect(myDeck.cards.length).to.equal(2);
        expect(myDeck.cardAmount[otherCard.id]).to.be.equal(1);

    });


});
