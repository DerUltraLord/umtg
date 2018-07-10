<template>
    <div>
        <div v-if="decks == null || decks.length == 0">
            <span class="badge badge-warning">No decks found.<br>Copy decklist text files into ~/.umtg/decks<br>and reload</span>
        </div>
    
        <div class="decksPage" v-else>
            <div class="scrollable">
                <DeckList @deckSelected=showCardsOfDeck :decks=decks :selectedDeck=selectedDeck></DeckList>
            </div>
            <div class="scrollable">
                <CardList :cards=cards></CardList>
                <Loader :loading=loading></Loader>
            </div>
        </div>
    </div>
</template>

<script>
import DeckList from './DeckList.vue'
import CardList from './CardList.vue'
import Loader from './Loader.vue'
import Deck from '../main/deck.js'
export default {
    data() {
        return {
            loading: false,
            selectedDeck: null,
            decks: [],
            cards: [],
        }
    },
    created: function () {
        this.loading = true;
        Deck.getDecks()
        .then((decks) => {
            this.decks = decks
            if (this.decks.length > 0) {
                this.showCardsOfDeck(this.decks[0]);
            }
            this.loading = false;
        });
    },
    methods: {
        showCardsOfDeck(deck) {
            this.loading = true;
            this.selectedDeck = deck;
            Deck.getCardsOfDeck(this.selectedDeck)
            .then(this.onDeckFromDb);
        },
        onDeckFromDb(deck) {
            this.cards = deck.cards;
            this.loading = false;
        }

    },
    components: {
        DeckList,
        CardList,
        Loader,

    }
}
</script>

<style scoped>

.decksPage {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 300px 1fr;
}

</style>
