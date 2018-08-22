
import { extendCards } from './umtg';
import { Dict, MagicSet, Card } from '../umtgTypes';
import { cardAdjustAmount, cardExistsById, getCardsOfSet, getSets, setAdd, getOwnedCardAmountBySetCode, isSetDownloaded, cardAdd } from '../db';
import { scryfallGetSets, scryfallReqest } from '../scryfall';

export interface CollectionState {
    loading: boolean;
    sets: Dict<MagicSet>;
    selectedSet: MagicSet | null;
    cards: Dict<Card>;
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
    setSets(state: CollectionState, sets: Dict<MagicSet>): void {
        state.sets = sets;
        state.loading = false;
    },
    setSelectedSet(state: CollectionState, set: MagicSet): void {
        state.selectedSet = set;
    },
    setCards(state: CollectionState, cards: Dict<Card>): void {
        state.cards = cards;
        state.loading = false;
    },
    setSelectedCard(state: CollectionState, card: Card): void {
        state.selectedCard = card;
    },
    setOwnedAmountOfCard(state: CollectionState, {card, amount}: {card: Card, amount: number}): void {
        state.cards[card.id].ownedAmount = amount;
    },
    setCollectedAmountBySetCode(state: CollectionState, {setCode, amount}: {setCode: string, amount: number}): void {
        if (state.sets[setCode]) {
            console.log(setCode);
            state.sets[setCode].collectedAmount = amount;
            console.log(state.sets[setCode].collectedAmount);
        }
    }

};

export const actions = {

    async updateSets({state, rootState, commit}: {state: CollectionState, rootState: any, commit: any}): Promise<null>  {
        state.loading = true;
        let sets = await getSets();
        if (sets.length === 0) {
            let setsFromScryfall = await scryfallGetSets();
            setsFromScryfall.data.forEach((s: MagicSet) => setAdd(s));
            sets = await getSets();
        }
        sets = sets.filter((s: MagicSet) => rootState.settings.setTypes[s.set_type]);
        let setsDict: Dict<MagicSet> = await extendSets(sets);
        commit('setSets', setsDict);
        return null;
    },

    async selectSet({state, commit}: {state: CollectionState, commit: any}, set: MagicSet): Promise<null> {
        state.loading = true;
        let cards: Card[];
        if (!set.downloaded) {
            cards = await scryfallReqest<Card>(set.search_uri);
            for (const card of cards) {
                cardAdd(card, 0);
            }
        }

        cards = await getCardsOfSet(set);
        let cardsDict: Dict<Card> = await extendCards(cards);

        commit('setCards', cardsDict);
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
};

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions
};
