<template>
    <div v-bind:class="[settings.isGridActive ? 'd-flex flex-wrap' : '']">
        <Card @click.native="$emit('cardClicked', c)" v-for="c in cards" v-bind:data="c" v-bind:key="c.id" :card=c :settings=settings v-bind:class="[selectedCard != null && selectedCard.id == c.id ? 'bg-primary' : '']"></Card>
    </div>
</template>

<script>
import Card from './Card.vue';

export default {
    props: ['cards','settings', 'selectedCard'],
    methods: {
    },
    components: {
        Card,
    },
};
</script>

<style scoped>

</style>
