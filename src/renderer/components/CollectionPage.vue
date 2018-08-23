<template>
    <div class="collectionPage">
        <div class="scrollable">
            <SetList @setClicked="showSet" :sets=$store.state.collection.sets :selectedSet=$store.state.collection.selectedSet></SetList>
        </div>
        <div class="scrollable">
            <CardList @cardClicked="cardClicked" :cards=$store.state.collection.cards :cardOrder=$store.state.collection.cardIds :selectedCard=$store.state.collection.selectedCard></CardList>
            <Loader :loading=$store.state.collection.loading></Loader>
        </div>
    </div>
</template>

<script>
import CardList from './CardList.vue';
import SetList from './SetList.vue';
import Loader from './Loader.vue';
export default {

    created: async function () {
        if (Object.keys(this.$store.state.collection.sets).length == 0) {
            this.$store.commit('collection/setLoading', true);
            await this.$store.dispatch('collection/updateSets');
            this.$store.commit('collection/setLoading', false);
        }
        
    },
    methods: {
        async showSet(set) {
            this.$store.commit('collection/setLoading', true);
            await this.$store.dispatch('collection/selectSet', set);
            await this.$store.dispatch('collection/filterCards');
            await this.$store.dispatch('collection/sortCards');
            this.$store.commit('collection/setLoading', false);

        },
        cardClicked(card) {
            this.$store.commit('collection/setSelectedCard', card);
        },
        onCards() {
            //this.loading = false;
        },

    },
    components: {
        CardList,
        SetList,
        Loader,
    }
};
</script>

<style scoped>
.collectionPage {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 300px 1fr;
}
</style>
