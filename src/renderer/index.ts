// @ts-ignore
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import 'bootstrap';
import Vue from 'vue';
import Vuex from 'vuex';
//import VModal from 'vue-js-modal';
import BootstrapVue from 'bootstrap-vue';
import App from './components/App.vue';

import storeDefinition from './store/store';
const sms = require('source-map-support');

Vue.use(require('vuex'));
Vue.use(require('vue-shortkey'));
//Vue.use(VModal);
Vue.use(BootstrapVue);

const store: any = new Vuex.Store(storeDefinition);

//console.log(store.getters.settings);

let Events = new Vue();

declare var __static: string;

(<any>window).__staticOffset = '';
if (process.env.NODE_ENV !== 'development') {
    // NOTE: dirty hack for static folder in production mode
    (<any>window).__staticOffset = '../static/';
}


Object.defineProperties(Vue.prototype, {
    Events: {
        get: function(): any {
            return Events;
        }
    }
});

new Vue({
    el: '#app',
    store: store,
    template: '<App/>',
    components: { App }
});
