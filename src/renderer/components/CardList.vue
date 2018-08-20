<template>
    <div v-bind:class="[$store.getters['settings/isGridActive'] ? 'd-flex flex-row flex-wrap' : '']">
        <Card @click.native="$emit('cardClicked', c)" v-for="c in cards" v-bind:data="c" v-bind:key="c.id" :card=c v-bind:class="[selectedCard != null && selectedCard.id == c.id ? 'bg-primary' : '']" :deck=deck></Card>
    </div>
</template>

<script>
import Card from './Card.vue';

export default {
    props: ['cards', 'selectedCard', 'deck'],
    methods: {
        foo() {
            console.log(this.cards);
        }
    },
    components: {
        Card,
    },
};
</script>

<style scoped>

</style>
