import { Card, Dict } from '../umtgTypes';
import * as Scryfall from '../scryfall';
import { getAmountOfCardById } from '../db';

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
}

export function updateCards(cards: Card[]): Dict<Card> {
    let initalValue: Dict<Card> = {};
    return cards.reduce((obj: Dict<Card>, card: Card) => {
        obj[card.id] = card;
        obj[card.id].ownedAmount = 0;
        getAmountOfCardById(card.id).then((amount) => {
            obj[card.id].ownedAmount = amount;
        });
        return obj;
    }, initalValue);
};

export const mutations = {
    setCards(state: SearchState, cards: Dict<Card>) {
        state.cards = cards;
        state.loading = false;
    }
};

export const actions = {
    doSearch({state, commit}: {state: SearchState, commit: any}): void {
        state.loading = true;
        let filter = Scryfall.getSearchFilter(state.name, state.type, state.text, state.edition);
        Scryfall.searchByFilter(filter)
        .then((response: any) => {
            if (response.data) {
                commit('setCards', updateCards(response.data));
            }
        });
    }
}

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
}
