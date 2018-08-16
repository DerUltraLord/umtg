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
                        <div class="media-body">
                            <div class="row">
                                <h2 class="col-lg-8">{{ card.name }}</h2>
                                <div ref="manaSymbols" class="col-lg-4"></div>
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
                    <CardButtons :card=card></CardButtons>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CardButtons from './CardButtons.vue';

export default {
    props: ['card'],
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
        }

    },
    mounted: function() {
        if (!this.$store.getters['settings/isGridActive']) {
            this.$refs.manaSymbols.insertAdjacentHTML('beforeend', this.getTagsForMana(this.card));
        }
    },
    components: {
        CardButtons,
    },
};
</script>

<style scoped>
</style>
