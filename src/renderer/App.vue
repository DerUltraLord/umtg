<template>
    <div>
        <Navigation :pages=pages :currentPage=currentPage @pageSelected="currentPage = $event.key"/>
        <SearchPage v-if="currentPage == 'search'"/>
        <CollectionPage v-if="currentPage == 'collection'"/>
    </div>
</template>

<script>
import Navigation from './Navigation.vue'
import SearchPage from './SearchPage.vue'
import CollectionPage from './CollectionPage.vue'
import Settings from '../settings.js'

console.log("Load settings ...");
Settings.init()
console.log("Settings loaded");


export default {
    data() {
        return {
            currentPage: 'search',
            pages: [
                { key:'search', name: "Seach" },
                { key: 'collection', name: "Collection" },
                { key: 'deck', name: "Deck" },
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

