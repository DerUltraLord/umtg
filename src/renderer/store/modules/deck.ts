const Vue = require('vue');
//import Vue from 'vue';
// TODO: import Vue does not work
import { openSync, readdirSync, readFileSync, writeFile } from 'fs';
import { Deck, DeckWithCards, Decklist, DecklistCard, Card, Dict } from '../umtgTypes';
import { matchRegex } from '../base';
import { getAmountOfCardById, cardExistsByName, getCardByName, cardAdd } from '../db';
import * as scry from '../scryfall';
import { filterCards } from './umtg';

function getCardObjectsFromCardNames(cards: DecklistCard[]): Promise<Dict<Card>> {
    let addedIds: string[] = [];
    return cards.reduce(async (p: any, card) => {
        let data: any = await p;
        let exists = await cardExistsByName(card.name);
        let dbCard: Card;
        if (exists) {
            dbCard = await getCardByName(card.name);
        } else {
            dbCard = await scry.getCardByName(card.name);
            if (addedIds.indexOf(dbCard.id) === -1) {
                cardAdd(dbCard, 0);
                addedIds.push(dbCard.id);
            }
        }
        dbCard.ownedAmount = await getAmountOfCardById(dbCard.id);
        data[dbCard.id] = dbCard;
        return Promise.resolve(data);
    }, Promise.resolve({}));
}

export function lineMatchCard(line: String): DecklistCard | null {
    let regexResult = matchRegex(/(\d+)\s(.*)/, line);
    if (regexResult) {
        let res: DecklistCard = {
            amount: Number(regexResult[1]),
            name: regexResult[2]
        };
        return res;
    }
    return null;
}

export function lineMatchSideboard(line: String): boolean {
    return matchRegex(/Sideboard:\s*/, line) ? true : false;
}

export function traverseCards(content: String): Decklist {

    let result :Decklist;
    let initialValue: Decklist = {
        cards: [],
        sideboard: []
    };
    let isSideboardActive = false;

    result = content
        .trim()
        .split('\n')
        .reduce((result: Decklist, line: string) => {

            let cardlist;
            cardlist = isSideboardActive ? result['sideboard'] : result['cards'];

            let cardResult = lineMatchCard(line);
            let sideboardResult = lineMatchSideboard(line);

            if (sideboardResult) {
                isSideboardActive = true;
            } else {
                if (cardResult) {
                    cardlist.push(cardResult);
                } else {
                    // TODO: line not matching
                }
            }

            return result;
        }, initialValue);
    return result;

}

export function deckAdjustCardAmount(deck: DeckWithCards, card: Card, amount: number): void {
    if (!(card.id in deck.cardAmount)) {
        deck.cards[card.id] = card;
        Vue.set(deck.cardAmount, card.id, 0);
    }
    deck.cardAmount[card.id] += amount;

    if (deck.cardAmount[card.id] < 0) {
        deck.cardAmount[card.id] = 0;
    }
}


export interface DeckState {
    loading: boolean;
    decksPath: string;
    decks: Deck[];
    deck: DeckWithCards | null;
    cards: Dict<Card>;
    selectedCard: Card | null;
}

export const state: DeckState = {
    loading: false,
    decksPath: process.env.HOME + '/.umtg/decks',
    decks: [],
    deck: null,
    cards: {},
    selectedCard: null
};

export function initDeckState(store: any): void {
    console.log("init deck state");
    if (store.state.deck.decks.length === 0) {
        store.dispatch('deck/updateDecks');
    }

    let availableDecks = store.state.deck.decks;
    if (!store.state.deck.selectedDeck && availableDecks.length > 0) {
        store.dispatch('deck/selectDeck', availableDecks[0]);
    }
}

export const mutations = {
    setDecks(state: DeckState, decks: Deck[]): void {
        state.decks = decks;
        state.loading = false;
    },
    setDeck(state: DeckState, deck: DeckWithCards): void {
        state.deck = deck;
        state.loading = false;
    },
    setCards(state: DeckState, cards: Dict<Card>): void {
        state.cards = cards;
        state.loading = false;
    },
    removeCardFromSelectedDeck(state: DeckState, card: Card): void {
        if (state.deck) {
            deckAdjustCardAmount(state.deck, card, -1);
        }
    },
    addCardToSelectedDeck(state: DeckState, card: Card): void {

        if (state.deck) {
            deckAdjustCardAmount(state.deck, card, 1);
        }
    },
    setSelectedCard(state: DeckState, card: Card): void {
        state.selectedCard = card;
    }
};

export const actions = {

    updateDecks({state, commit}: {state: DeckState, commit: any}): void {
        state.loading = true;
        let decks: Deck[] = readdirSync(state.decksPath).map((filename: string) => {
            let deckItem: Deck = {
                name: filename.split('.')[0],
                filename: filename
            };
            return deckItem;
        });
        commit('setDecks', decks);
    },

    async selectDeck({state, commit, rootState}: {state: DeckState, commit: any, rootState: any}, deck: Deck): Promise<void> {
        state.loading = true;
        let contents = readFileSync(state.decksPath + '/' + deck.filename).toString();
        let deckResult = traverseCards(contents);

        let cards = await getCardObjectsFromCardNames(deckResult.cards);
        let sideboard = await getCardObjectsFromCardNames(deckResult.sideboard);
        let amountDict: Dict<number> = {};

        Object.keys(cards).forEach((cardId: string, i: number)  => {
            amountDict[cardId] = deckResult.cards[i].amount;
        });

        let result: DeckWithCards = {
            deck: deck,
            cards: cards,
            sideboard: sideboard,
            cardAmount: amountDict,
        };
        commit('setDeck', result);
        commit('setCards', filterCards(result.cards, rootState.umtg.filterColors));
    },

    writeDeckToDisk({state}: {state: DeckState}): void {
        if (state.deck) {
            let data = '';
            for (const cardId of Object.keys(state.deck.cards)) {
                let card = state.deck.cards[cardId];
                data += state.deck!.cardAmount[card.id] + " " + card.name + "\n";
            }
            writeFile(state.decksPath + '/' + state.deck.deck.filename, data, 'ascii', (err) => err ? console.error(err) : null);
        }
        },

    createDeck({state, commit}: {state: DeckState, commit: any}, deckname: string): Promise<void> {
        openSync(state.decksPath + '/' + deckname + '.txt', 'w');
        return Promise.resolve();
    },
    filterCards({state, commit, rootState}: {state: DeckState, commit: any, rootState: any}): void {
        commit('setCards', filterCards(state.deck!.cards, rootState.umtg.filterColors));
    }
};


export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions
};
