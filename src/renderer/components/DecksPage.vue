<template>
    <div>
        <!--
        <div v-if="state.decks == null || state.decks.length == 0">
            <span class="badge badge-warning">No decks found.<br>Copy decklist text files into ~/.umtg/decks<br>and reload</span>
        </div>
        -->
    
        <div class="decksPage">
            <div class="scrollable">
                <DeckList @deckSelected=deckSelected :decks=$store.state.deck.decks :selectedDeck=$store.state.deck.deck></DeckList>
            </div>
            <div class="scrollable">
                <CardList v-if=$store.state.deck.deck @cardClicked="cardClicked" :cards=$store.state.deck.deck.cards :selectedCard=$store.state.deck.selectedCard></CardList>
                <Loader :loading=$store.state.deck.loading></Loader>
            </div>
        </div>
    </div>
</template>

<script>
import DeckList from './DeckList.vue';
import CardList from './CardList.vue';
import Loader from './Loader.vue';
import * as Model from '../store/model.ts';
export default {
    created: function () {

    },
    methods: {
        showCardsOfDeck(deck) {
        },
        deckSelected(deck) {
            this.$store.dispatch('deck/selectDeck', deck);
        },
        cardClicked(card) {
            this.$store.commit('deck/setSelectedCard', card);
        },
    },
    components: {
        DeckList,
        CardList,
        Loader,
    }
};
</script>

<style scoped>

.decksPage {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 300px 1fr;
}

</style>
