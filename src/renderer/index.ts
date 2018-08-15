import 'bootstrap/dist/css/bootstrap.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import 'bootstrap';
import Vue from 'vue';
import Vuex from 'vuex';
import App from './components/App.vue';

import storeDefinition from './store/store';
import { init } from './store/db';
init('TODO.db');

Vue.use(Vuex);

const store = new Vuex.Store(storeDefinition);

console.log(store.getters.settings);

let Events = new Vue();

Object.defineProperties(Vue.prototype, {
    Events: {
        get: function(): any {
            return Events;
        }
    }
});

new Vue({
    el: '#app',
    store,
    template: '<App/>',
    components: { App }
});
