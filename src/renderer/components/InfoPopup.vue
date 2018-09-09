<template>
    <b-modal ref="InfoPopup" centered v-bind:title=this.card.name>
        <b-container>
            <b-row v-for="cardAttrib in this.$store.state.settings.infoPopupContent" v-bind:key=cardAttrib.displayName v-bind:data=cardAttrib>
                
                <b-col v-if=card[cardAttrib.property]>{{ cardAttrib.displayName }}</b-col>
                <b-col v-if=card[cardAttrib.property]>{{ card[cardAttrib.property] }}</b-col>
            </b-row>
            <b-row>
                <b-col>Links</b-col>
                <b-col>
                    <ul>
                        <li><a @click=openExternal v-bind:href=this.card.rulings_uri>Rulings</a></li>
                        <li><a @click=openExternal v-bind:href=this.card.scryfall_uri>Scryfall</a></li>
                    </ul>
                </b-col>
            </b-row>
        </b-container>
    </b-modal>
</template>
<script>
import { shell } from 'electron';

export default {
    props: ['card'],
    methods: {
        openExternal(e) {
            shell.openExternal(e.srcElement.href);
            e.preventDefault();
        },
        show() {
            this.$refs.InfoPopup.show();
        }
    },
};
</script>