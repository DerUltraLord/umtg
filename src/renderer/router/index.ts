import VueRouter from "vue-router";

import SearchPage from '@/components/SearchPage.vue';
import CollectionPage from '@/components/CollectionPage.vue';
import CollectionOverviewPage from '@/components/CollectionOverviewPage.vue';
import DecksPage from '@/components/DecksPage.vue';
import SettingsPage from '@/components/SettingsPage.vue';
import BasicRouter from '@/components/BasicRouter.vue';

const routes= [
    {
        path: '/search',
        name: 'Search',
        icon: 'search',
        component: SearchPage,
    },
    {
        path: '/collection',
        name: 'Collection',
        icon: 'dashboard',
        component: BasicRouter,
        redirect: '/collection/sets',
        children: [
            {
                path: 'sets',
                component: CollectionOverviewPage,
                name:"Sets" 
            },
            {
                path: 'cards',
                component: CollectionPage,
                name:"Cards" 
            }
        ]
    },
    {
        path: '/decks',
        name: 'Decks',
        icon: 'line_weight',
        component: DecksPage,
    },
    {
        path: '/settings',
        name: 'Settings',
        icon: 'settings',
        component: SettingsPage,
    }
]

export let routesDef = routes;
export default new VueRouter({routes})