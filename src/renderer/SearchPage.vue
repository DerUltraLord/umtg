<template>
    <div class="cardSearch">

        <CardSearch @searchCard=searchCard></CardSearch>
        <div class="scrollable">
            <CardList :cards=state.searchCards :settings=state.settings></CardList>
            <Loader :loading=loading></Loader>
        </div>
    </div>


</template>

<script>
import CardSearch from './CardSearch.vue'
import CardList from './CardList.vue'
import Loader from './Loader.vue'
import Model from '../main/model.js'

export default {
    props: ['state'],
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        searchCard(filter) {
            this.loading = true;
            Model.searchScryfallByFilter(filter)
            .then(console.log(this.state.searchCards))
            .catch(this.loading = false);
        },
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
