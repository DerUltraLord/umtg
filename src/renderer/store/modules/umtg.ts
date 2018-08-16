import { Card, Dict } from '../umtgTypes';
import { getAmountOfCardById } from '../db';

export interface UmtgState {
    currentPage: string;
    pages: any,
}

export async function updateCards(cards: Card[]): Promise<Dict<Card>> {
    let result: Dict<Card> = {};

    for (const card of cards) {
        result[card.id] = card;
        result[card.id].ownedAmount = await getAmountOfCardById(card.id)
    }

    return result;
};

export const state: UmtgState = {
    currentPage: 'search',
    pages: {
        'search': {
            name: 'Search'
        },
        'collection': {
            name: 'Collection'
        },
    },
};

export const mutations = {
    setCurrentPage(state: UmtgState, currentPage: string): void {
        state.currentPage = currentPage;
    },
}

export const getters = {
    getCardsForSearchPage(state: UmtgState): Dict<Card> {
        return state.pages.search.cards;
    },
    getSelectedSearchCard(state: UmtgState): Card | null {
        return state.pages.search.selectedCard;
    },
}

export default { 
    state: state,
    mutations: mutations,
    getters: getters
};
