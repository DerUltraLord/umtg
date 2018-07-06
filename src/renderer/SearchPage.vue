<template>
    <div class="cardSearch">

        <CardSearch @searchCard=searchCard></CardSearch>
        <div class="scrollable">
            <CardList :cards=cards></CardList>
        </div>
    </div>


</template>

<script>
import CardSearch from './CardSearch.vue'
import CardList from './CardList.vue'
import Scryfall from '../scryfall.js'
export default {

    data() {
        return {
            cards: [],
        }
    },
    methods: {
        searchCard(filter) {
            Scryfall.searchByFilter(filter)
            .then(this.onDataAvailable)
            .catch(this.onDataNotAvailable);
        },
        onDataAvailable(data) {
            this.$data.cards = data.data
            console.log(data.data);
        },
        onDataNotAvailable() {
        }
    },
    components: {
        CardSearch,
        CardList,
    }
}
</script>

<style scoped>

.cardSearch {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 300px 3fr;
}

</style>
