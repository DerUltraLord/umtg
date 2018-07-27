<template>
    <div v-bind:class="[settings.isGridActive ? 'd-flex flex-wrap' : '']">
        <Card @click.native="$emit('cardClicked', c)" v-for="c in cards" v-bind:data="c" v-bind:key="c.id" :card=c :settings=settings v-bind:class="[selectedCardId == c.id ? 'bg-primary' : '']"></Card>
    </div>
</template>

<script>
import Card from './Card.vue'

export default {
    props: ['cards', 'settings', 'selectedCardId'],
    methods: {
    },
    components: {
        Card,
    },
}
</script>

<style scoped>

</style>
