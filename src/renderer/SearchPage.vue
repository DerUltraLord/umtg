<template>
    <div class="cardSearch">

        <CardSearch @searchCard=searchCard></CardSearch>
        <div class="scrollable">
            <CardList :cards=cards></CardList>
            <Loader :loading=loading></Loader>
        </div>
    </div>


</template>

<script>
import CardSearch from './CardSearch.vue'
import CardList from './CardList.vue'
import Loader from './Loader.vue'
import Scryfall from '../main/scryfall.js'
export default {

    data() {
        return {
            cards: [],
            loading: false,
        }
    },
    methods: {
        searchCard(filter) {
            this.$data.loading = true;
            Scryfall.searchByFilter(filter)
            .then(this.onDataAvailable)
            .catch(this.onDataNotAvailable);
        },
        onDataAvailable(data) {
            this.$data.cards = data.data
            this.$data.loading = false;
            console.log(data.data);
        },
        onDataNotAvailable() {
            this.$data.loading = false;
        }
    },
    components: {
        CardSearch,
        CardList,
        Loader,
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
