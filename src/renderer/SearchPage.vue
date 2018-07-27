<template>
    <div class="cardSearch">

        <CardSearch @searchCard=searchCard></CardSearch>
        <div class="scrollable">
            <CardList @cardClicked="cardClicked" :cards=state.pages.search.cards :settings=state.settings :selectedCard=state.pages.search.selectedCard></CardList>
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
    mounted: function() {
    },
    methods: {
        searchCard(filter) {
            this.loading = true;
            Model.searchScryfallByFilter(filter)
            .then(() => this.loading = false)
            .catch(console.error);
        },
        cardClicked(card) {
            this.state.pages.search.selectedCard = card;
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
