<template>
    <div class="collectionPage">
        <div class="scrollable">
            <SetList @setClicked="showSet" :sets=state.sets :selectedSet=selectedSet></SetList>
        </div>
        <div class="scrollable">
            <CardList :cards=state.setCards :settings=state.settings></CardList>
            <Loader :loading=loading></Loader>
        </div>
    </div>
</template>

<script>
import CardList from './CardList.vue'
import SetList from './SetList.vue'
import Loader from './Loader.vue'
import Model from '../main/model.js'
export default {

    props: ['state'],
    data() {
        return {
            selectedSet: null,
            loading: false,
        }
    },
    created: function () {
        this.loading = true;
        Model.updateSets()
        .then(this.onUpdateSets)
        .catch(console.error);
        
    },
    methods: {
        onUpdateSets() {
            let setKeys = Object.keys(this.state.sets);
            if (setKeys.length > 0) {
                this.showSet(this.state.sets[setKeys[0]]);
            } else {
                this.loading = false;
            }
        },
        showSet(set) {
            this.loading = true;
            this.selectedSet = set;
            Model.updateCardsBySet(set)
            .then(this.onCards);
        },
        onCards(cards) {
            this.loading = false;
        },

    },
    components: {
        CardList,
        SetList,
        Loader,
    }




}
</script>

<style scoped>
.collectionPage {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 300px 1fr;
}
</style>
