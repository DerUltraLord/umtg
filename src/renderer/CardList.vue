<template>
    <div v-bind:class="[isGridActive ? 'd-flex flex-row flex-wrap' : 'list-group-item']">
        <Card v-for="c in cards" v-bind:data="c" v-bind:key="c.id" :card=c :isGridActive=isGridActive></Card>
    </div>
</template>

<script>
import Card from './Card.vue'
import Settings from '../main/settings.js'
export default {
    props: ["cards"],
    data() {
        return {
            isGridActive: Settings.isGridActive()
        }
    },
    components: {
        Card,
    },
    methods: {
    }
}
</script>
