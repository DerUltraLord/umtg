import { readdirSync } from 'fs';
import { Card, Deck, DeckContents, CardDecklist } from './umtgTypes'
import { readFile, matchRegex } from './base'
import { cardExistsByName, getCardByName, cardAdd } from './db';
import * as scry from './scryfall';

var DECKS_PATH = process.env.HOME + '/.umtg/decks';

export function getDecks() : Deck[] {
    let result : Deck[] = readdirSync(DECKS_PATH).map((filename : string) => {
        let deckItem : Deck = {
            name: filename.split('.')[0],
            filename: filename,
        }
        return deckItem;
    })
    return result;
};

export async function getCardsOfDeck(deck : Deck) : Promise<DeckContents> {
    let contents = await readFile(DECKS_PATH + '/' + deck.filename);
    let deckResult = exports.traverseCards(contents);

    let cards = await exports.getCardObjectsFromCardNames(deckResult.cards);
    let sideboard = await exports.getCardObjectsFromCardNames(deckResult.sideboard);

    let result : DeckContents = {
        cards: cards,
        sideboard: sideboard,
    }
    return result;
};

exports.getCardObjectsFromCardNames = cards => {
    let addedIds = [];
    return cards.reduce(async (p, card) => {
        let data = await p;
        let exists = await cardExistsByName(card.name);
        let dbCard = null;
        if (exists) {
            dbCard = await getCardByName(card.name);
        } else {
            dbCard = await scry.getCardByName(card.name);
            if (addedIds.indexOf(dbCard.id) == -1) {
                cardAdd(dbCard, 0);
                addedIds.push(dbCard.id);
            }
        }
        dbCard['amount'] = Number(card.amount);
        data.push(dbCard);
        return Promise.resolve(data);
    }, Promise.resolve([]));
};

export function traverseCards(content : String) : any {

    let result = {};
    let initialValue = {};
    let isSideboardActive = false;

    result = content
        .trim()
        .split('\n')
        .reduce((result, line) => {
            result['cards'] = result['cards'] || [];
            result['sideboard'] = result['sideboard'] || [];

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

};

export function lineMatchCard(line : String) : CardDecklist {
    let regexResult = matchRegex(/(\d+)\s(.*)/, line);
    let res = null;
    if (regexResult) {
        res = {
            amount: Number(regexResult[1]),
            name: regexResult[2],
        };
    }
    return res;
};

export function lineMatchSideboard(line : String) {
    return matchRegex(/Sideboard:\s*/, line) ? true : false;
}

export function addCardToDeck(deck : DeckContents, card : Card) : void {
    deck.cards.push(card);
};

