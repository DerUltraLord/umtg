import { Card, Dict } from '../umtgTypes';
import { getAmountOfCardById } from '../db';

let colorSortValues: any = {
    W: 0,
    U: 1,
    B: 2,
    R: 3,
    G: 4,
    C: 5,
};

export interface UmtgState {
    currentPage: string;
    pages: any;
    filterColors: string[];
    filterString: string;
    sortString: string;
}

export async function extendCards(cards: Card[]): Promise<Dict<Card>> {
    let result: Dict<Card> = {};

    for (const card of cards) {
        result[card.id] = card;
        result[card.id].ownedAmount = await getAmountOfCardById(card.id);
    }

    return result;
}

export function filterCards(cards: Dict<Card>, colors: string[], name: string): string[] {

    let result: string[] = [];
    if (cards) {
        for (const cardId of Object.keys(cards)) {
            let matchesColor = false;
            // TODO: flip cards
            matchesColor = colors.some((color) => cards[cardId].colors && cards[cardId].colors.includes(color));

            if (!matchesColor && colors.indexOf('C') >= 0) {
                matchesColor = cards[cardId].colors === undefined || cards[cardId].colors.length === 0;
            }
            let matchesName = cards[cardId].name.toLowerCase().includes(name.toLowerCase());
            if (matchesColor && matchesName) {
                result.push(cardId);
            }
        }
    }
    return result;
}

export function sortCards(cards: Dict<Card>, cardIdList: string[], sortProperty: string): string[] {

    let getValue = (v: string) => cards[v][sortProperty];
    if (sortProperty == 'colors') {
        getValue = (v: string) => colorSortValues[cards[v][sortProperty] && cards[v][sortProperty].length === 1 ? cards[v][sortProperty][0] : 'C'];
    }
    let result = cardIdList.sort((a, b) => {
        return getValue(a) - getValue(b);
    });
    return result;
}

export const state: UmtgState = {
    currentPage: 'search',
    pages: {
        'search': {
            name: 'Search'
        },
        'collection': {
            name: 'Collection'
        },
        'deck': {
            name: 'Decks'
        },
        'settings': {
            name: 'Settings'
        },
    },
    filterColors: ["W", "U", "B", "R", "G", "C"],
    filterString: '',
    sortString: 'cmc',
};

export const mutations = {
    setCurrentPage(state: UmtgState, currentPage: string): void {
        state.currentPage = currentPage;
    },
};

export const getters = {
    getCardsForSearchPage(state: UmtgState): Dict<Card> {
        return state.pages.search.cards;
    },
    getSelectedSearchCard(state: UmtgState): Card | null {
        return state.pages.search.selectedCard;
    },
};

export default { 
    state: state,
    mutations: mutations,
    getters: getters
};
