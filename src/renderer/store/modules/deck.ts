import { readdirSync, readFileSync, writeFile } from 'fs';
import { Deck, DeckWithCards, Decklist, DecklistCard, Card, Dict } from '../umtgTypes';
import { matchRegex } from '../base';
import { cardExistsByName, getCardByName, cardAdd } from '../db';
import * as scry from '../scryfall';

function getCardObjectsFromCardNames(cards: DecklistCard[]): Promise<Card[]> {
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
        dbCard['amount'] = Number(card.amount);
        data.push(dbCard);
        return Promise.resolve(data);
    }, Promise.resolve([]));
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

export interface DeckState {
    decksPath: string;
    decks: Deck[];
    deck: DeckWithCards | null;
}

export const state: DeckState = {
    decksPath: process.env.HOME + '/.umtg/decks',
    decks: [],
    deck: null,
}

export const mutations = {
    setDecks(state: DeckState, decks: Deck[]): void {
        state.decks = decks;
    },
    setDeck(state: DeckState, deck: DeckWithCards): void {
        state.deck = deck;
    },
    addCardToDeck(state: DeckState, card: Card): void {

        if (state.deck) {
            if (!(card.id in state.deck.cardAmount)) {
                state.deck.cards.push(card);
                state.deck.cardAmount[card.id] = 0;
            }
            state.deck.cardAmount[card.id] += 1;
        }
    }
    

}

export const actions = {

    updateDecks({state, commit}: {state: DeckState, commit: any}): void {
        let decks: Deck[] = readdirSync(state.decksPath).map((filename: string) => {
            let deckItem: Deck = {
                name: filename.split('.')[0],
                filename: filename
            };
            return deckItem;
        });
        commit('setDecks', decks);
    },

    async selectDeck({state, commit, payload}: {state: DeckState, commit: any, payload: Deck}): Promise<void> {
        let contents = readFileSync(state.decksPath + '/' + payload.filename).toString();
        let deckResult = traverseCards(contents);

        let cards = await getCardObjectsFromCardNames(deckResult.cards);
        let sideboard = await getCardObjectsFromCardNames(deckResult.sideboard);
        let amountDict: Dict<number> = {};

        cards.forEach((card, i)  => {
            amountDict[card.id] = deckResult.cards[i].amount;
        });

        let result: DeckWithCards = {
            deck: payload,
            cards: cards,
            sideboard: sideboard,
            cardAmount: amountDict,
        };
        commit('setDeck', result);
    },

    writeDeckToDisk({state}: {state: DeckState}): void {
        if (state.deck) {
            let data = '';
            state.deck.cards.forEach((card) => {
                data += card.amount + " " + card.name + "\n";
            });
            writeFile(state.decksPath + '/' + state.deck.deck.filename, data, 'ascii', (err) => console.error(err));
        }
    }
}


export default {
    state: state,
    mutations: mutations,
    actions: actions
}
