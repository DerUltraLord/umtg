<template>
    <div >
        <Card v-for="c in cards" v-bind:data="c" v-bind:key="c.id" :card=c :model=model v-bind:class="[model.settings.isGridActive ? 'd-flex flex-row flex-wrap' : 'list-group-item']"></Card>
    </div>
</template>

<script>
import Card from './Card.vue'
export default {
    props: ["cards", 'model'],
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
