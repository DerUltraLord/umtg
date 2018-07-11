<template>
    <div class="collectionPage">
        <div class="scrollable">
            <SetList @setClicked="showSet" :sets=sets :selectedSet=selectedSet></SetList>
        </div>
        <div class="scrollable">
            <CardList :cards=cards :settings=settings></CardList>
            <Loader :loading=loading></Loader>
        </div>
    </div>
</template>

<script>
import CardList from './CardList.vue'
import SetList from './SetList.vue'
import Loader from './Loader.vue'
import Db from '../main/db.js'
import Scryfall from '../main/scryfall.js'
import Base from '../main/base.js'
export default {

    props: ['settings'],
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
        Db.getSets()
        .then((sets) => {
            if (sets.length == 0) {
                Scryfall.scryfallGetSets()
                .then(this.onSetsFromScryfall);
            } else {
                this.onGetSetsFromDb(sets);
            }
        });
        
    },
    methods: {
        onCardsFromDb(cards) {
            console.log(cards);
        },
        onSetsFromScryfall(res) {
            res.data.forEach((set) => {
                Db.setAdd(set);
            });
            Db.getSets()
            .then(this.onGetSetsFromDb);
        },
        onGetSetsFromDb(sets) {
            this.sets = sets.filter(set => this.settings.data.setTypes[set.set_type]);
            if (sets.length > 0) {
                this.showSet(sets[0]);
            }
        },
        showSet(set) {
            this.loading = true;
            this.selectedSet = set;
            Db.getCardsOfSet(set)
            .then(this.onCardsFromDb);
        },
        onCardsFromDb(cards) {
            if (cards.length < this.selectedSet.card_count) {
                console.log(this.selectedSet.search_uri);
                Base.getJSON(this.selectedSet.search_uri)
                .then(this.onCardsFromScryfall);
            } else {
                this.loading = false;
                this.cards = cards;
            }
        },
        onCardsFromScryfall(res) {
            res.data.forEach((card) => {
                Db.cardAdd(card, 0);
            });
            if (res.has_more == true) {
                Base.getJSON(res.next_page)
                .then(this.onCardsFromScryfall);
            } else {
                Db.getCardsOfSet(this.selectedSet)
                .then(this.onCardsFromDb);
            }
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
