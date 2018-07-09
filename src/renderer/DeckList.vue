<template>
    <div>
        <Deck @click.native="$emit('deckSelected', deck)" v-for="deck in decks" v-bind:data="deck" v-bind:key="deck" v-bind:class="['list-group-item', selectedDeck != null && selectedDeck == deck ? 'list-group-item-info' : '']" :deck=deck></Deck>
    </div>
</template>

<script>
import Deck from './Deck.vue'
export default {
    props: ['decks', 'selectedDeck'],
    components: {
        Deck,
    }
}
</script>
