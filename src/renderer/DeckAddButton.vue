<template>
    <div class="btn-group btn-group-lg float-lg-left" role="group">
        <button type="button" id="btnAddToDeck" @click="addCardToDeck" class="btn btn-default">+</button>
        <div class="btn-group btn-group-sm dropup" role="group">
            <button type="button" class="textOverflowHidden btn btn-default dropdown-toggle btnDeck w300 text-left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">choose deck</button>
            <div class="dropdown-menu" aria-labelledby="btnDeck">
                <a v-for="deck in decks" class="dropdown-item" @click="deckSelected(deck)">{{ deck }}</a>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
import Deck from '../deck.js'
export default {
    data() {
        return {
            decks: [],
        }
    },
    created: function() {
        Deck.getDecks()
        .then(decks => this.decks = decks);
    },
    methods: {
        addCardToDeck() {
        },
        deckSelected(deck) {
            $(".btnDeck").html(deck);
        },
    }
}
</script>
<style scoped>
.w300 {
    width: 300px;
}
</style>
