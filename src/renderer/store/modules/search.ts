import { Card, Dict } from '../umtgTypes';
import * as Scryfall from '../scryfall';
import { getAmountOfCardById } from '../db';
import { extendCards, filterCards } from './umtg';
import { PageWithCards, baseMutations, baseActions } from './pageWithCards';

export interface SearchState extends PageWithCards  {
    loading: boolean;
    name: string;
    type: string;
    text: string;
    edition: string;
}

export const state = {
    loading: false,
    cards: {},
    selectedCard: null,
    cardIds: [],
    name: '',
    type: '',
    text: '',
    edition: ''
};


export const mutations = {
    setLoading(state: SearchState, value: boolean): void {
        state.loading = value;
    },
    setCards: baseMutations.setCards,
    setCardIds: baseMutations.setCardIds,
    setSelectedCard: baseMutations.setSelectedCard,
};

export const actions = {
    async doSearch({state, commit}: {state: SearchState, commit: any}): Promise<null> {
        let filter = Scryfall.getSearchFilter(state.name, state.type, state.text, state.edition);
        let cards: Card[] = await Scryfall.searchByFilter(filter);
        let cardsDict: Dict<Card> = await extendCards(cards);
        commit('setCards', cardsDict);
        commit('setCardIds', Object.keys(cardsDict));
        return null;
    },
    filterCards: baseActions.filterCards,
    sortCards: baseActions.sortCards
};

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
};
