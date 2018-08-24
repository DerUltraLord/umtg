<template>
    <div ref="root" v-bind:class="[$store.getters['settings/isGridActive'] ? 'p-2' : 'list-group-item']">
        <div v-if="!$store.getters['settings/isGridActive']" class="container"> 
            <div class="row"> 
                <div class="col col-12"> 
                    <div class="media">
                        <div class="m20">
                            <img v-bind:src="card.image_uris ? card.image_uris.art_crop : ''" width="250" height="200">
                            <div>
                            </div>
                        </div>
                        <div class="media-body p-2">
                            <div class="row">
                                <h2 class="col-lg-8">{{ card.name }}</h2>
                                <div v-html="tagsForMana" class="col-lg-4"></div>
                            </div>
                            <div class="row">
                                <p class="col-lg-12">{{ card.oracle_text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="container">
            <div class="row">
                <div class="col">
                    <img v-bind:src="getImageUri()" width="250px" height="348px">
                </div>
            </div>
            <div class="row mt10">
                <div class="col">
                    <CardButtons @addCard="addCardToCollection" @removeCard="removeCardFromCollection" :card=card :amount=card.ownedAmount></CardButtons>
                </div>
                <div v-if=this.deck class="col text-right">
                    <CardButtons @addCard="addCardToDeck" @removeCard="removeCardFromDeck" :card=card :amount=deckAmount :deck=deck></CardButtons>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CardButtons from './CardButtons.vue';

export default {
    props: ['card', 'deck'],
    methods: {
        getImageUri() {
            let uri = '';
            if (this.card.image_uris) {
                uri = this.card.image_uris.normal;
            } else if(this.card.card_faces) {
                uri = this.card.card_faces[0].image_uris.normal;
            }
            return uri;
        },
        getTagsForMana(card) {
            let re = /\{\w\}/g;
            let res = '';
            let m;
            m = re.exec(card.mana_cost);
            while (m != null) {
                let manaString = m[0].substring(1, m[0].length - 1);
                manaString = '<img src="icons/' + manaString + '.svg" class="float-lg-right" width=24>';
                res = manaString + res;
                m = re.exec(card.mana_cost);
            }
            return res;
        },
        addCardToCollection() {
            this.$store.dispatch('collection/addCardToCollection', this.card)
                .then(() => {
                    this.$store.dispatch('collection/updateCollectedAmountBySetCode', this.card.set);
                });
        },
        removeCardFromCollection() {
            this.$store.dispatch('collection/removeCardFromCollection', this.card)
                .then(() => {
                    this.$store.dispatch('collection/updateCollectedAmountBySetCode', this.card.set);
                });
        },
        addCardToDeck() {
            this.$store.commit('deck/addCardToSelectedDeck', this.card);
            this.$store.dispatch('deck/writeDeckToDisk');
        },
        removeCardFromDeck() {
            this.$store.commit('deck/removeCardFromSelectedDeck', this.card);
            this.$store.dispatch('deck/writeDeckToDisk');
        }

    },
    computed: {
        tagsForMana() {
            return this.getTagsForMana(this.card);
        },
        deckAmount() {
            let index = this.deck.decklist.cards.map((card) => card.name).indexOf(this.card.name);
            if (index >= 0) {
                return this.deck.decklist.cards[index].amount;
            }
            return 0;
        }
    },
    components: {
        CardButtons,
    },
};
</script>

<style scoped>
</style>
