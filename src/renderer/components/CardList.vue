<template>
    <v-container>
        <v-layout row wrap>
            <Card @click.native="$emit('cardClicked', cards[cardId])" v-for="cardId in cardOrder" v-bind:key=cardId :card=cards[cardId] v-bind:class="[selectedCard != null && selectedCard.id == cardId ? 'bg-primary' : '']" :deck=deck></Card>
        </v-layout>
    </v-container>
    <!-- <div v-bind:class="[$store.getters['settings/isGridActive'] ? 'd-flex flex-row flex-wrap' : '']">
        <Card @click.native="$emit('cardClicked', cards[cardId])" v-for="cardId in cardOrder" v-bind:key=cardId :card=cards[cardId] v-bind:class="[selectedCard != null && selectedCard.id == cardId ? 'bg-primary' : '']" :deck=deck></Card>
    </div> -->
</template>

<script>
import Card from './Card.vue';

export default {
    props: ['cards', 'cardOrder', 'selectedCard', 'deck'],
    methods: {
    },
    components: {
        Card,
    },
};
</script>

<style scoped>

</style>
