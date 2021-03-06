//const Vue = require('vue');
import Vue from 'vue';
import path from 'path';
// TODO: import Vue does not work
import { openSync, readdirSync, readFileSync, writeFile } from 'fs';
import { Deck, DeckWithCards, Decklist, DecklistCard, Card, Dict } from '../umtgTypes';
import { matchRegex } from '../base';
import { getAmountOfCardById, cardExistsByName, getCardByName, cardAdd } from '../db';
import * as scry from '../scryfall';
import { filterCards } from './umtg';
import { PageWithCards, baseMutations, baseActions } from './pageWithCards';

function getDecksPath(rootState: any, filename: string) {
    return path.join(rootState.settings.settingsPath, rootState.settings.decksFolder, filename);
}

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
    let cardNames = deck.decklist.cards.map((decklistCard) => decklistCard.name);
    let cardIndex = cardNames.indexOf(card.name);
    if (cardIndex >= 0) {
        deck.decklist.cards[cardIndex].amount += amount;
        if (deck.decklist.cards[cardIndex].amount < 0) {
            deck.decklist.cards[cardIndex].amount = 0;
        }
    } else {
        if (amount < 0) {
            amount = 0;
        }
        deck.decklist.cards.push({name: card.name, amount: amount});
    }
}

export interface DeckState extends PageWithCards {
    loading: boolean;
    decks: Deck[];
    deck: DeckWithCards | null;
}

export const state: DeckState = {
    loading: false,
    decks: [],
    deck: null,
    cards: {}, // TODO: Not used
    cardIds: [],
    selectedCard: null
};

export function initDeckState(store: any): void {
    if (store.state.deck.decks.length === 0) {
        store.dispatch('deck/updateDecks');
    }

    let availableDecks = store.state.deck.decks;
    if (!store.state.deck.selectedDeck && availableDecks.length > 0) {
        store.dispatch('deck/selectDeck', availableDecks[0]);
        store.dispatch('deck/updateCardsOfSelectedDeck');
    }
}

export const mutations = {
    setLoading(state: DeckState, value: boolean): void {
        state.loading = value;
    },
    setDecks(state: DeckState, decks: Deck[]): void {
        state.decks = decks;
    },
    setDeck(state: DeckState, deck: DeckWithCards): void {
        state.deck = deck;
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
    setCards: baseMutations.setCards,
    setSelectedCard: baseMutations.setSelectedCard,
    setCardIds: baseMutations.setCardIds
};

export const actions = {

    updateDecks({state, commit, rootState}: {state: DeckState, commit: any, rootState: any}): void {
        let decks: Deck[] = readdirSync(path.join(rootState.settings.settingsPath, rootState.settings.decksFolder)).map((filename: string) => {
            let deckItem: Deck = {
                name: filename.split('.')[0],
                filename: filename
            };
            return deckItem;
        });
        commit('setDecks', decks);
    },
    async updateCardsOfSelectedDeck({state, commit}: {state: DeckState, commit: any}): Promise<void> {
        let cards = await getCardObjectsFromCardNames(state.deck!.decklist.cards);
        commit('setCards', cards);
        commit('setCardIds', Object.keys(cards));
    },
    async selectDeck({state, commit, rootState}: {state: DeckState, commit: any, rootState: any}, deck: Deck): Promise<void> {
        let contents = readFileSync(getDecksPath(rootState, deck.filename)).toString();
        let decklist = traverseCards(contents);

        let result: DeckWithCards = {
            deck: deck,
            decklist: decklist
        };
        commit('setDeck', result);
    },

    writeDeckToDisk({state, rootState}: {state: DeckState, rootState:any}): void {
        if (state.deck) {
            let data = '';
            for (const decklistCard of state.deck.decklist.cards) {
                data += decklistCard.amount + " " + decklistCard.name + "\n";
            }
            writeFile(getDecksPath(rootState, state.deck.deck.filename), data, 'ascii', (err) => err ? console.error(err) : null);
        }
        },

    createDeck({state, commit, rootState}: {state: DeckState, commit: any, rootState: any}, deckname: string): Promise<void> {
        openSync(getDecksPath(rootState, deckname + '.txt'), 'w');
        return Promise.resolve();
    },

    filterCards: baseActions.filterCards,
    sortCards: baseActions.sortCards
};


export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions
};
