<template>
    <v-flex :xs12="$store.getters['settings/isGridActive'] ? false : true" ref="root">
        <InfoPopup ref="infoPopup" :card=this.card></InfoPopup>
        <v-card v-if="!$store.getters['settings/isGridActive']" color="blue-grey darken-2" class="white--text">
            <v-card-title primary-title>
            <div class="headline">{{ card.name }}</div>
            <div>{{ card.oracle_text }}</div>
           
            </v-card-title>
            <v-card-actions>
            <v-btn flat dark>TODO card Buttons</v-btn>
            </v-card-actions>
        </v-card>
    

        <v-card-flat v-else>
            <v-img :src="getImageUri()" width="250px" height="358px"></v-img>
            <v-container>
                <v-layout>
                    <v-flex>
                        <CardButtons @addCard="addCardToCollection" @removeCard="removeCardFromCollection" :card=card :amount=card.ownedAmount></CardButtons>
                    </v-flex>
                    <v-flex v-if=this.deck>
                        <CardButtons @addCard="addCardToDeck" @removeCard="removeCardFromDeck" :card=card :amount=deckAmount :deck=deck></CardButtons>
                    </v-flex>
                    <v-flex>
                        <v-btn @click=btnInfoClicked>Info</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-flat> 
  
    </v-flex>
</template>

<script>
import InfoPopup from './InfoPopup.vue'
import CardButtons from './CardButtons.vue';

export default {
    props: ['card', 'deck'],
    methods: {
        btnInfoClicked() {
            this.$refs.infoPopup.show();
        },
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
                manaString = '<img src="' + window.__staticOffset + 'icons/' + manaString + '.svg" class="float-lg-right" width=24>';
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
        InfoPopup,
        CardButtons,
    },
};
</script>

<style scoped>
</style>
