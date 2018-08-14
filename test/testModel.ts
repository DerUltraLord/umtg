import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';

import * as Model from '../src/main/model';
import * as Settings from '../src/main/settings';
import * as DeckManager from '../src/main/deck';
import * as Db from '../src/main/db';
import { Deck, DeckWithCards, Card, Dict } from '../src/main/umtgTypes';

let sandbox: SinonSandbox;

let fakeDeck1 = { name: 'deck1', filename: 'deck1.txt' };
let fakeCard: Card = {
    id: 'ultra-id',
    name: 'Ultra Lord',
};

describe('model.js', () => {
    beforeEach((done) => {
        sandbox = createSandbox();
        sandbox.stub(Settings, 'init').callsFake(() => {});
        sandbox.stub(DeckManager, 'getDecks').callsFake(() => {
            let res: Deck[] = [];
            res.push(fakeDeck1);
            res.push({ name: 'deck2', filename: 'deck2.txt' });
            return res;
        });
        sandbox.stub(DeckManager, 'getCardsOfDeck').callsFake(() => {
            let cardAmount: Dict<number> = {};
            cardAmount[fakeCard.id] = 1;
            let res: DeckWithCards = {
                deck: fakeDeck1,
                cards: [fakeCard],
                sideboard: [],
                cardAmount: cardAmount,
            };
            return Promise.resolve(res);
        });
        sandbox.stub(DeckManager, 'writeDeckToDisk').callsFake(() => null);
        Model.init(':memory:')
        .then(() => done());
    });

    afterEach(() => sandbox.restore());

    it('initializes correctly', () => {
        expect(Model.state.settings.data).to.be.undefined;
        let decksPage = Model.getDecksPage();
        let selectedDeck = decksPage.selectedDeck;
        expect(selectedDeck!.deck.name).to.be.equal('deck1');
        expect(decksPage.decks.length).to.be.equal(2);
    });

    it('can select a deck', (done) => {
        let selectedDeck = Model.getDecksPage().selectedDeck;
        expect(selectedDeck).to.be.not.null;
        Model.selectDeck(Model.getDecksPage().decks[1])
        .then(() => {
            selectedDeck = Model.getDecksPage().selectedDeck;
            expect(selectedDeck!.deck.name).to.be.equal('deck2');
            expect(selectedDeck!.cards.length).to.be.equal(1);
            expect(selectedDeck!.cards[0].name).to.be.equal('Ultra Lord');
            expect(selectedDeck!.cards[0].amount).to.be.equal(0);
            done();
        });
    });

    it('can add a card to selected deck', () => {
        Model.addCardToSelectedDeck({ name: 'AddCardTest', id: 'AddCardTest' });
        let selectedDeck: DeckWithCards = Model.getDecksPage().selectedDeck!;
        // TODO: handle card with same name
        expect(selectedDeck.cards.length).to.be.equal(2);
        expect(selectedDeck.cards[1].name).to.be.equal('AddCardTest');
        expect(selectedDeck.cardAmount[selectedDeck.cards[1].id]).to.be.equal(1);
    });

    it('can add a card to the collection', (done) => {
        Model.addCardToCollection(fakeCard)
        .then(() => {
            expect(Model.state.pages.collection.cards[fakeCard.id].ownedAmount).to.be.equal(1);
            done();
        });
    });

    it('can remove a card from the collection', (done) => {
        Db.db.serialize(() => {
            Model.addCardToCollection(fakeCard)
            .then(() => Model.removeCardFromCollection(fakeCard))
            .then(() => {
                expect(Model.state.pages.collection.cards[fakeCard.id].ownedAmount).to.be.equal(0);
                done();
            });
        });
    });


    //it('can get sets', (done) => {
    //    Model.updateSets()
    //    .then((sets) => {
    //        done();
    //    });
    //});

    //it('can get card of set', (done) => {
    //    let rix = {

    //        code: 'rix',
    //        card_count: 205,
    //        search_uri: 'https://api.scryfall.com/cards/search?order=set\u0026q=e%3Arix\u0026unique=prints'
    //    };
    //    Model.getCardsOfSet(rix)
    //    .then((cards) => {
    //        expect(cards.length).to.be.equal(205);
    //        done();
    //    });
    //}).timeout(10000);
});
