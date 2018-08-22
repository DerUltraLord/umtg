import { Card, Dict } from '../umtgTypes';
import * as Scryfall from '../scryfall';
import { getAmountOfCardById } from '../db';
import { extendCards } from './umtg';

export interface SearchState  {
    loading: boolean;
    cards: Dict<Card>;
    selectedCard: Card | null;
    name: string;
    type: string;
    text: string;
    edition: string;
}

export const state = {
    loading: false,
    cards: {},
    selectedCard: null,
    name: '',
    type: '',
    text: '',
    edition: ''
};


export const mutations = {
    setCards(state: SearchState, cards: Dict<Card>): void {
        state.cards = cards;
        state.loading = false;
    },
    setSelectedCard(state: SearchState, card: Card): void {
        state.selectedCard = card;
    }
};

export const actions = {
    async doSearch({state, commit}: {state: SearchState, commit: any}): Promise<null> {
        state.loading = true;
        let filter = Scryfall.getSearchFilter(state.name, state.type, state.text, state.edition);
        let cards: Card[] = await Scryfall.searchByFilter(filter);
        let cardsDict: Dict<Card> = await extendCards(cards);
        commit('setCards', cardsDict);
        return null;
    }
};

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
};
