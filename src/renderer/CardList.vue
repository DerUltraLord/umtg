<template>
    <div >
        <Card v-for="c in cards" v-bind:data="c" v-bind:key="c.id" :card=c :settings=settings v-bind:class="[settings.data.isGridActive ? 'd-flex flex-row flex-wrap' : 'list-group-item']"></Card>
    </div>
</template>

<script>
import Card from './Card.vue'
export default {
    props: ["cards", 'settings'],
    data() {
        return {
        }
    },
    components: {
        Card,
    },
    methods: {
    }
}
</script>
