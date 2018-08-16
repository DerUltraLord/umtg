<template>
    <div class="collectionPage">
        <div class="scrollable">
            <SetList @setClicked="showSet" :sets=$store.state.collection.sets :selectedSet=$store.state.collection.selectedSet></SetList>
        </div>
        <div class="scrollable">
            <CardList @cardClicked="cardClicked" :cards=$store.state.collection.cards :selectedCard=$store.state.collection.selectedCard></CardList>
            <Loader :loading=$store.state.collection.loading></Loader>
        </div>
    </div>
</template>

<script>
import CardList from './CardList.vue';
import SetList from './SetList.vue';
import Loader from './Loader.vue';
import * as Model from '../store/model.ts';
export default {

    created: function () {
        if (Object.keys(this.$store.state.collection.sets).length == 0) {
            this.$store.dispatch('collection/updateSets');
        }
        
    },
    methods: {
        //onUpdateSets() {
        //    let setKeys = Object.keys(this.state.pages.collection.sets);
        //    if (setKeys.length > 0) {
        //        this.showSet(this.state.pages.collection.sets[setKeys[0]]);
        //    } else {
        //        this.loading = false;
        //    }
        //},
        showSet(set) {
            this.$store.dispatch('collection/selectSet', set);
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
