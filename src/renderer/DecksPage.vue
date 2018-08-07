<template>
    <div>
        <!--
        <div v-if="state.decks == null || state.decks.length == 0">
            <span class="badge badge-warning">No decks found.<br>Copy decklist text files into ~/.umtg/decks<br>and reload</span>
        </div>
        -->
    
        <div class="decksPage">
            <div class="scrollable">
                <DeckList @deckSelected=deckSelected :decks=state.decks :selectedDeck=state.selectedDeck></DeckList>
            </div>
            <div class="scrollable">
                <CardList @cardClicked="cardClicked" :cards=state.pages.decks.cards :settings=state.settings :selectedCard=state.pages.decks.selectedCard></CardList>
                <Loader :loading=loading></Loader>
            </div>
        </div>
    </div>
</template>

<script>
import DeckList from './DeckList.vue';
import CardList from './CardList.vue';
import Loader from './Loader.vue';
import * as Model from '../main/model.ts';
export default {
    props: ['state'],
    data() {
        return {
            loading: false,
        };
    },
    created: function () {
        if (Object.keys(this.state.pages.decks.cards).length == 0) {
            this.showCardsOfDeck(this.state.selectedDeck);
        }

    },
    methods: {
        showCardsOfDeck(deck) {
            this.loading = true;
            this.state.selectedDeck = deck;
            Model.updateDeckCards(this.state.selectedDeck)
                .then(() => this.loading = false)
                .catch(console.error);

        },
        deckSelected(deck) {
            if (this.state.selectedDeck != deck) {
                this.showCardsOfDeck(deck);
            }
        },
        cardClicked(card) {
            this.state.pages.decks.selectedCard = card;
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
