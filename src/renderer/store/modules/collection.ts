import Vue from 'vue';

import { extendCards, filterCards, sortCards } from './umtg';
import { Dict, MagicSet, Card } from '../umtgTypes';
import { cardAdjustAmount, cardExistsById, getCardsOfSet, getSets, setAdd, getOwnedCardAmountBySetCode, isSetDownloaded, cardAdd } from '../db';
import { scryfallGetSets, scryfallReqest } from '../scryfall';
import { PageWithCards, baseMutations, baseActions } from './pageWithCards';

export interface CollectionState extends PageWithCards {
    loading: boolean;
    sets: Dict<MagicSet>;
    selectedSet: MagicSet | null;
    selectedCard: Card | null;
}

export const state = {
    loading: false,
    sets: {},
    selectedSet: null,
    cards: {},
    selectedCard: null,
};

export async function extendSets(sets: MagicSet[]): Promise<Dict<MagicSet>> {
    let result: Dict<MagicSet> = {};
    for (const set of sets) {
        set.ownedAmount = null;
        result[set.code] = set;
        result[set.code].collectedAmount = await getOwnedCardAmountBySetCode(set.code);
        result[set.code].downloaded = await isSetDownloaded(set);
    }
    return result;
}

export async function adjustCardAmountOfCollection(state: CollectionState, card: Card, amount: number): Promise<number> {
    let exist: boolean = await cardExistsById(card.id);
    if (exist) {
        amount = await cardAdjustAmount(card, amount);
    } else{
        cardAdd(card, amount);
    }
    return amount;
}

export const mutations = {
    setLoading(state: CollectionState, value: boolean): void {
        state.loading = value;
    },
    setSets(state: CollectionState, sets: Dict<MagicSet>): void {
        state.sets = sets;
    },
    setSelectedSet(state: CollectionState, set: MagicSet): void {
        state.selectedSet = set;
    },
    setOwnedAmountOfCard(state: CollectionState, {card, amount}: {card: Card, amount: number}): void {
        card.ownedAmount = amount;
        if (state.cards[card.id]) {
            state.cards[card.id] = card;
        }
    },
    setCollectedAmountBySetCode(state: CollectionState, {setCode, amount}: {setCode: string, amount: number}): void {
        if (state.sets[setCode]) {
            state.sets[setCode].collectedAmount = amount;
        }
    },
    setCards: baseMutations.setCards,
    setCardIds: baseMutations.setCardIds,
    setSelectedCard: baseMutations.setSelectedCard
};

export const actions = {

    async updateSets({state, rootState, commit}: {state: CollectionState, rootState: any, commit: any}): Promise<null>  {
        let sets = await getSets();
        if (sets.length === 0) {
            let setsFromScryfall = await scryfallGetSets();
            setsFromScryfall.data.forEach((s: MagicSet) => setAdd(s));
            sets = await getSets();
        }
        sets = sets.filter((s: MagicSet) => rootState.settings.setTypes.selected.includes(s.set_type));
        let setsDict: Dict<MagicSet> = await extendSets(sets);
        commit('setSets', setsDict);
        return null;
    },

    async selectSet({state, commit}: {state: CollectionState, commit: any}, set: MagicSet): Promise<null> {
        let cards: Card[];
        if (!set.downloaded) {
            cards = await scryfallReqest<Card>(set.search_uri);
            for (const card of cards) {
                cardAdd(card, 0);
            }
            set.downloaded = true;
        }

        cards = await getCardsOfSet(set);
        let cardsDict: Dict<Card> = await extendCards(cards);

        commit('setCards', cardsDict);
        commit('setCardIds', Object.keys(cardsDict));
        commit('setSelectedSet', set);

        return null;
    },

    async addCardToCollection({state, commit}: {state: CollectionState, commit: any}, card: Card): Promise<null> {
        let amount = await exports.adjustCardAmountOfCollection(state, card, 1);
        commit('setOwnedAmountOfCard', {card: card, amount: amount});
        return null;
    },

    async removeCardFromCollection({state, commit}: {state: CollectionState, commit: any}, card: Card): Promise<null> {
        let amount = await exports.adjustCardAmountOfCollection(state, card, -1);
        commit('setOwnedAmountOfCard', {card: card, amount: amount});
        return null;
    },

    async updateCollectedAmountBySetCode({state, commit}: {state: CollectionState, commit: any}, setCode: string): Promise<null> {
        let collectedAmount = await getOwnedCardAmountBySetCode(setCode);
        commit('setCollectedAmountBySetCode', {setCode: setCode, amount: collectedAmount});
        return null;
    },
    filterCards: baseActions.filterCards,
    sortCards: baseActions.sortCards
};

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions
};
