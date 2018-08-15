import { Card, Dict } from '../umtgTypes';

export interface UmtgState {
    currentPage: string;
    pages: any,
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
