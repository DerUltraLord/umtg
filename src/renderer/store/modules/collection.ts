
import { extendCards } from './umtg';
import { Dict, MagicSet, Card } from '../umtgTypes';
import { getCardsOfSet, getSets, setAdd, getOwnedCardAmountBySetCode, isSetDownloaded, cardAdd } from '../db';
import { scryfallGetSets, scryfallReqest } from '../scryfall';

export interface CollectionState {
    loading: boolean;
    sets: Dict<MagicSet>;
    selectedSet: MagicSet | null;
    cards: Dict<Card>;
    selectedCard: Card | null;
};


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
        result[set.code].ownedCards = await getOwnedCardAmountBySetCode(set.code);
        result[set.code].downloaded = await isSetDownloaded(set);
    }
    return result;
};

export const mutations = {
    setSets(state: CollectionState, sets: Dict<MagicSet>) {
        state.sets = sets;
        state.loading = false;
    },
    setCards(state: CollectionState, cards: Dict<Card>) {
        state.cards = cards;
        state.loading = false;
    }
};

export const actions = {

    async updateSets({state, rootState, commit}: {state: CollectionState, rootState: any, commit: any}): Promise<null>  {
        state.loading = true;
        let sets = await getSets()
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
                await cardAdd(card, 0);
            }
        }

        cards = await getCardsOfSet(set);
        let cardsDict: Dict<Card> = await extendCards(cards);

        commit('setCards', cardsDict);

        return null;
    }

};

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions
};
