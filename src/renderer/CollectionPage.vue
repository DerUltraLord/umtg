<template>
    <div class="collectionPage">
        <div class="scrollable">
            <SetList @setClicked="showSet" :sets=sets :selectedSet=selectedSet></SetList>
        </div>
        <div class="scrollable">
            <CardList :cards=cards :state=state></CardList>
            <Loader :loading=loading></Loader>
        </div>
    </div>
</template>

<script>
import CardList from './CardList.vue'
import SetList from './SetList.vue'
import Loader from './Loader.vue'
import Model from '../main/model.js'
import Db from '../main/db.js'
import Scryfall from '../main/scryfall.js'
import Base from '../main/base.js'
export default {

    props: ['state'],
    data() {
        return {
            selectedSet: null,
            loading: false,
            cards: [],
            sets: [],
        }
    },
    created: function () {
        this.loading = true;
        Model.getSets()
        .then(this.onGetSets);
        
    },
    methods: {
        onGetSets(sets) {
            this.sets = sets.filter(set => this.state.settings.setTypes[set.set_type]);
            console.log(this.sets);
            if (sets.length > 0) {
                console.log("SHOW SET");
                this.showSet(sets[0]);
            }
        },
        showSet(set) {
            this.loading = true;
            this.selectedSet = set;
            Model.getCardsOfSet(set)
            .then(this.onCards);
        },
        onCards(cards) {
            console.log("finished");
            console.log(cards);
            this.loading = false;
            this.cards = cards;

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
