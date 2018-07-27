<template>
    <div>
        <Navigation :pages=state.pages :currentPage=state.currentPage @pageSelected="state.currentPage = $event"/>
        <SearchPage :state=state v-if="state.currentPage == 'search'"/>
        <CollectionPage :state=state v-if="state.currentPage == 'collection'"/>
        <DecksPage :state=state v-if="state.currentPage == 'decks'"/>
        <SettingsPage :state=state v-if="state.currentPage == 'settings'"/>
        <Footer :state=state></Footer>
    </div>
</template>

<script>
import Model from '../main/model.js'

import Navigation from './Navigation.vue'
import SearchPage from './SearchPage.vue'
import CollectionPage from './CollectionPage.vue'
import DecksPage from './DecksPage.vue'
import SettingsPage from './SettingsPage.vue'
import Footer from './Footer.vue'
import Db from '../main/db.js'




export default {
    data() {
        return {
            state: Model.state,
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

