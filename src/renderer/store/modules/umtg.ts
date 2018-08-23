import { Card, Dict } from '../umtgTypes';
import { getAmountOfCardById } from '../db';

export interface UmtgState {
    currentPage: string;
    pages: any;
    filterColors: string[];
    filterString: string;
}

export async function extendCards(cards: Card[]): Promise<Dict<Card>> {
    let result: Dict<Card> = {};

    for (const card of cards) {
        result[card.id] = card;
        result[card.id].ownedAmount = await getAmountOfCardById(card.id);
    }

    return result;
}

export function filterCards(cards: Dict<Card>, colors: string[], name: string): Dict<Card> {

    let result: Dict<Card> = {};
    if (cards) {
        for (const cardId of Object.keys(cards)) {
            let matchesColor = false;
            if (colors.length > 0) {
                matchesColor = colors.some((color) => cards[cardId].colors && cards[cardId].colors.includes(color));
            } else {
                matchesColor = cards[cardId].colors === undefined || cards[cardId].colors.length === 0;
            }
            let matchesName = cards[cardId].name.toLowerCase().includes(name.toLowerCase());
            if (matchesColor && matchesName) {
                result[cardId] = cards[cardId];
            }
        }
    }
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
    filterColors: ["W", "U", "B", "R", "G"],
    filterString: ''
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
