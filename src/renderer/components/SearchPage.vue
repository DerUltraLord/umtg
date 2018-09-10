<template>
    <div class="cardSearch">

    <CardSearch></CardSearch>
   
        <div class="scrollable">

            <CardList @cardClicked="$store.commit('search/setSelectedCard', $event)" :cards="$store.state.search.cards" :cardOrder="$store.state.search.cardIds" :selectedCard=$store.state.search.selectedCard></CardList>

            <Loader :loading=$store.state.search.loading></Loader>
        </div>
    </div>


</template>

<script>
import CardSearch from './CardSearch.vue';
import CardList from './CardList.vue';
import Loader from './Loader.vue';

export default {
    mounted: function() {
    },
    methods: {
    },
    components: {
        CardSearch,
        CardList,
        Loader,
    }
};
</script>

<style scoped>

.cardSearch {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 300px 3fr;
}

</style>
