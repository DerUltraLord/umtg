<template>
    <div v-if=$store.state.deck.deck class="btn-group btn-group-lg float-lg-left" role="group">
        <button type="button" id="btnAddToDeck" @click="addCardToDeck" class="btn btn-default">+</button>
        <div class="btn-group btn-group-sm dropup" role="group">
            <button type="button" class="textOverflowHidden btn btn-default dropdown-toggle btnDeck w300 text-left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ this.$store.state.deck.deck.deck.name }}</button>
            <div class="dropdown-menu" aria-labelledby="btnDeck">
                <a v-for="deck in $store.state.deck.decks" v-bind:key="deck.filename" class="dropdown-item" @click="deckSelected(deck)">{{ deck.name }}</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted: function() {
    },
    methods: {
        async addCardToDeck() {
            let selectedCard = this.$store.state[this.$store.state.umtg.currentPage].selectedCard;
            if (selectedCard) {
                this.$store.commit('deck/addCardToSelectedDeck', selectedCard);
                await this.$store.dispatch('deck/updateCardsOfSelectedDeck');
                await this.$store.dispatch('deck/writeDeckToDisk');
            } else {
                alert('No card selected');
            }
        },
        deckSelected(deck) {
            this.$store.dispatch('deck/selectDeck', deck);
            this.$store.dispatch('deck/updateCardsOfSelectedDeck');
        },
    }
};
</script>
<style scoped>
.w300 {
    width: 300px;
}
</style>
