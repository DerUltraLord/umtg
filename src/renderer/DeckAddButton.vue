<template>
    <div class="btn-group btn-group-lg float-lg-left" role="group">
        <button type="button" id="btnAddToDeck" @click="addCardToDeck" class="btn btn-default">+</button>
        <div class="btn-group btn-group-sm dropup" role="group">
            <button type="button" class="textOverflowHidden btn btn-default dropdown-toggle btnDeck w300 text-left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ this.state.selectedDeck }}</button>
            <div class="dropdown-menu" aria-labelledby="btnDeck">
                <a v-for="deck in state.decks" class="dropdown-item" @click="deckSelected(deck)">{{ deck }}</a>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
import Deck from '../main/deck.js'
export default {
    props: ['state'],
    mounted: function() {
    },
    methods: {
        addCardToDeck() {
        },
        deckSelected(deck) {
            this.state.selectedDeck = deck;
        },
    }
}
</script>
<style scoped>
.w300 {
    width: 300px;
}
</style>
