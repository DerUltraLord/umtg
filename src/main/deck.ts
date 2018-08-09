import { readdirSync } from 'fs';
import { Card, Deck, Decklist, DecklistCard, DeckWithCards } from './umtgTypes';
import { readFile, matchRegex } from './base';
import { cardExistsByName, getCardByName, cardAdd } from './db';
import * as scry from './scryfall';

let DECKS_PATH = process.env.HOME + '/.umtg/decks';

export function getDecks(): Deck[] {
    let result: Deck[] = readdirSync(DECKS_PATH).map((filename: string) => {
        let deckItem: Deck = {
            name: filename.split('.')[0],
            filename: filename
        };
        return deckItem;
    });
    return result;
}

export async function getCardsOfDeck(deck: Deck): Promise<DeckWithCards> {
    let contents = await readFile(DECKS_PATH + '/' + deck.filename);
    let deckResult = exports.traverseCards(contents);

    let cards = await getCardObjectsFromCardNames(deckResult.cards);
    let sideboard = await getCardObjectsFromCardNames(deckResult.sideboard);

    let result: DeckWithCards = {
        cards: cards,
        sideboard: sideboard
    };
    return result;
}

function getCardObjectsFromCardNames(cards: Card[]) {
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

export function traverseCards(content: String): any {

    let result = {};
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

export function lineMatchSideboard(line: String) {
    return matchRegex(/Sideboard:\s*/, line) ? true : false;
}

export function addCardToDeck(deck: DeckWithCards, card: Card): void {
    deck.cards.push(card);
}
