<template>
    <div class="btn-group btn-group-lg float-lg-left" role="group">
        <button type="button" id="btnAddToDeck" @click="addCardToDeck" class="btn btn-default">+</button>
        <div class="btn-group btn-group-sm dropup" role="group">
            <button ref="btnDeck" type="button" class="textOverflowHidden btn btn-default dropdown-toggle btnDeck w300 text-left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <div class="dropdown-menu" aria-labelledby="btnDeck">
                <a v-for="deck in decks" class="dropdown-item" @click="deckSelected(deck)">{{ deck }}</a>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
import Deck from '../main/deck.js'
export default {
    props: ['decks'],
    mounted: function() {
        console.log(this.decks);
        if (this.decks.length > 0) {
            this.deckSelected(this.decks[0]);
        }
    },
    methods: {
        addCardToDeck() {
        },
        deckSelected(deck) {
            this.$refs.btnDeck.innerHTML = deck;
        },
    }
}
</script>
<style scoped>
.w300 {
    width: 300px;
}
</style>
