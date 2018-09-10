<template>
    <div>
        <v-app>
           
            <v-navigation-drawer clipped fixed app router v-model="drawer">
                <v-list dense>
                    <template v-for="item in routesDef">
                        <v-list-group v-if="item.children" :key="item.name"  value="true">
                         
                            <v-list-tile slot="activator">
                                 <v-list-tile-action>
                                    <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile v-for="child in item.children" :key=child.name @click="" :to="item.path + '/' + child.path">
                                <v-list-tile-action>
                                    <v-icon v-if="child.icon">{{ child.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ child.name }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        
                        </v-list-group>

                        <v-list-tile v-else :key="item.name" :to="item.path">
                            <v-list-tile-action>
                                <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>

                    </template>
              
                </v-list>
            </v-navigation-drawer>
           
            <v-toolbar fixed app clipped-left dark class="grey darken-4">
                <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title class="mr-2">UMTG</v-toolbar-title>
                
               
                <v-toolbar-items>
                    <v-btn class="hidden-sm-and-down" flat v-for="item in routesDef" :key="item.name" router :to="item.path">
                        <v-icon left>{{ item.icon }}</v-icon>
                        {{ item.name }}
                    </v-btn>
                </v-toolbar-items>
                 <v-spacer></v-spacer>
            </v-toolbar>
            <main>
                <v-content>
                    <router-view></router-view>
                </v-content>
              
            </main>
         

           
<!--             <header>
                <Navigation :pages=$store.state.umtg.pages :currentPage=$store.state.umtg.currentPage @pageSelected="$store.commit('setCurrentPage', $event)"/>
            </header>
        
            <main>
                <SearchPage v-if="$store.state.umtg.currentPage == 'search'"/>
                <CollectionPage v-if="$store.state.umtg.currentPage == 'collection'"/>
                <DecksPage v-if="$store.state.umtg.currentPage == 'deck'"/>
                <SettingsPage v-if="$store.state.umtg.currentPage == 'settings'"/>
            </main>

            <footer>
                <Footer></Footer>
            </footer> -->
        </v-app>
    </div>

</template>

<script>
import Navigation from './Navigation.vue';
import SearchPage from './SearchPage.vue';
import CollectionPage from './CollectionPage.vue';
import CollectionOverviewPage from './CollectionOverviewPage'
import DecksPage from './DecksPage.vue';
import SettingsPage from './SettingsPage.vue';
import Footer from './Footer.vue';
import BasicRouter from './BasicRouter.vue';
import { routesDef } from './../router/index'


import { init } from '../store/db';
import { initDeckState } from '../store/modules/deck';
import { initSettings } from '../store/modules/settings';

export default {
    data: function() {
        return {
            drawer: true,
            menuItems: [
                { icon: 'search', title: 'Search', link: '/search' },
                { icon: 'dashboard', title: 'Collection', link: '/collection' },
                { icon: 'settings', title: 'Decks', link: '/decks' },
                { icon: 'settings', title: 'Settings', link: '/settings' },
            ],
            routesDef,
         
        }
    },
    methods: {
        show() {
            this.$modal.show('InfoPopup');
        }
    },
    components: {
        Navigation,
        SearchPage,
        CollectionPage,
        DecksPage,
        SettingsPage,
        CollectionOverviewPage,
        Footer,
        BasicRouter,
    },
    beforeCreate: function() {
        initSettings(this.$store);
        init('umtg.db');
        initDeckState(this.$store);
    }
};
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
    max-height: calc(100vh - 120px);
}

main {
    height: calc(100vh - 120px);
}

.pageWithSidebar {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 300px 3fr;
}

</style>

