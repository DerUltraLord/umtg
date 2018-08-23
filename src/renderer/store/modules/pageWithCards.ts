import Vue from 'vue';
import { Dict, Card } from '../umtgTypes';
import { filterCards, sortCards } from './umtg';

export interface PageWithCards {
    cards: Dict<Card>;
    selectedCard: Card | null;
    cardIds: string[];
}

export const baseMutations = {
    setCards(state: PageWithCards, cards: Dict<Card>): void {
        state.cards = cards;
    },
    setCardIds(state: PageWithCards, idList: string[]): void {
        Vue.set(state, 'cardIds', idList);
    },
    setSelectedCard(state: PageWithCards, card: Card): void {
        state.selectedCard = card;
    },
};

export const baseActions = {
    filterCards({state, commit, rootState}: {state: PageWithCards, commit: any, rootState: any}): void {
        let cardIdList = filterCards(state.cards, rootState.umtg.filterColors, rootState.umtg.filterString);
        commit('setCardIds', cardIdList);
    },
    sortCards({state, commit, rootState}: {state: PageWithCards, commit: any, rootState: any}): void {
        let cardIdList = sortCards(state.cards, state.cardIds, rootState.umtg.sortString);
        commit('setCardIds', cardIdList);
    }
};