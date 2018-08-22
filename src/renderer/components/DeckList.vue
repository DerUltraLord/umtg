<template>
    <div>
        <Deck @click.native="$emit('deckSelected', deck)" v-for="deck in decks" v-bind:data="deck" v-bind:key="deck.filename" v-bind:class="['list-group-item', selectedDeck != null && selectedDeck.deck.filename == deck.filename ? 'list-group-item-info' : '']" :deck=deck></Deck>
        <div class="list-group-item">
            <input ref="deckName">
            <button @click="createDeck" type="button" class="btn btn-sm btn-success">
                <span class="oi oi-plus" title="icon plus" aria-hidden="false"></span>
            </button>
        </div>
    </div>
</template>

<script>
import Deck from './Deck.vue';
import * as Model from '../store/model.ts';
export default {
    props: ['decks', 'selectedDeck'],
    components: {
        Deck,
    },
    methods: {
        createDeck() {
            let deckName = this.$refs.deckName.value;
            if (deckName) {
                this.$store.dispatch('deck/createDeck', deckName);
                this.$store.dispatch('deck/updateDecks');
            }

        }
    }

};
</script>

<style scoped>
</style>
