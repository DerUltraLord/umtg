<template>
    <div class="collectionPage">
        <div class="scrollable">
            <SetList @setClicked="showSet" :sets=state.pages.collection.sets :selectedSet=state.selectedSet></SetList>
        </div>
        <div class="scrollable">
            <CardList @cardClicked="cardClicked" :cards=state.pages.collection.cards :settings=state.settings :selectedCard=state.pages.collection.selectedCard></CardList>
            <Loader :loading=loading></Loader>
        </div>
    </div>
</template>

<script>
import CardList from './CardList.vue';
import SetList from './SetList.vue';
import Loader from './Loader.vue';
import * as Model from '../main/model.ts';
export default {

    props: ['state'],
    data() {
        return {
            loading: false,
        };
    },
    created: function () {
        if (Object.keys(this.state.pages.collection.sets).length == 0) {
            this.loading = true;
            Model.updateSets()
                .then(this.onUpdateSets)
                .catch(console.error);
        }
        
    },
    methods: {
        onUpdateSets() {
            let setKeys = Object.keys(this.state.pages.collection.sets);
            if (setKeys.length > 0) {
                this.showSet(this.state.pages.collection.sets[setKeys[0]]);
            } else {
                this.loading = false;
            }
        },
        showSet(set) {
            this.loading = true;
            this.state.selectedSet = set;
            Model.updateCardsBySet(set)
                .then(this.onCards);
        },
        cardClicked(card) {
            this.state.pages.collection.selectedCard = card;
        },
        onCards() {
            this.loading = false;
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
