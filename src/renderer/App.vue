<template>
    <div>
        <Navigation :pages=pages :currentPage=currentPage @pageSelected="currentPage = $event.key"/>
        <SearchPage :state=state v-if="currentPage == 'search'"/>
        <CollectionPage :state=state v-if="currentPage == 'collection'"/>
        <DecksPage :state=state v-if="currentPage == 'decks'"/>
        <SettingsPage :state=state v-if="currentPage == 'settings'"/>
        <Footer :state=state></Footer>
    </div>
</template>

<script>
import Navigation from './Navigation.vue'
import SearchPage from './SearchPage.vue'
import CollectionPage from './CollectionPage.vue'
import DecksPage from './DecksPage.vue'
import SettingsPage from './SettingsPage.vue'
import Footer from './Footer.vue'
import Model from '../main/model.js'
import Db from '../main/db.js'

console.log("Load settings ...");
Model.init('test.db')
console.log("Settings loaded");



export default {
    data() {
        return {
            state: Model.state,
            currentPage: 'search',
            pages: [
                { key:'search', name: "Seach" },
                { key: 'collection', name: "Collection" },
                { key: 'decks', name: "Decks" },
                { key: 'settings', name: "Settings" },
                { key: 'about', name: "About" },
            ]
        }
    },
    methods: {
    },
    components: {
        Navigation,
        SearchPage,
        CollectionPage,
        DecksPage,
        SettingsPage,
        Footer,
    },
}
</script>

<style>

:root {
    --color-brown: #ebdbb2;
    --color-background: #eeeeec;
    --color-font-fg: black;
    --color-header: #283f51;
    --color-background-two: lightgrey;
}

body {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    color: var(--color-font-fg);
    margin-top: 0px;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    
    background-color: var(--color-background);
}

input {
   background: transparent;
   border: 0px solid black;
   border-bottom: 2px solid #3c3836;
   outline: none;
}



.scrollable {
    overflow: auto;
    max-height: calc(100vh - 45px);
}

</style>

