<template>
    <div>
        <div v-if="state.decks == null || state.decks.length == 0">
            <span class="badge badge-warning">No decks found.<br>Copy decklist text files into ~/.umtg/decks<br>and reload</span>
        </div>
    
        <div class="decksPage" v-else>
            <div class="scrollable">
                <DeckList @deckSelected=showCardsOfDeck :decks=state.decks :selectedDeck=state.selectedDeck></DeckList>
            </div>
            <div class="scrollable">
                <CardList :cards=state.deckCards :settings=state.settings></CardList>
                <Loader :loading=loading></Loader>
            </div>
        </div>
    </div>
</template>

<script>
import DeckList from './DeckList.vue'
import CardList from './CardList.vue'
import Loader from './Loader.vue'
import Model from '../main/model.js'
export default {
    props: ['state'],
    data() {
        return {
            loading: false,
        }
    },
    created: function () {
        this.loading = true;
        Model.updateDecks()
        .then(() => {
            if (this.state.decks.length > 0) {
                this.showCardsOfDeck(this.state.decks[0]);
            }
        })
        .catch(console.error);

    },
    methods: {
        showCardsOfDeck(deck) {
            this.loading = true;
            this.state.selectedDeck = deck;
            Model.updateDeckCards(this.state.selectedDeck)
            .then(() => this.loading = false)
            .catch(console.error);
        },
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
