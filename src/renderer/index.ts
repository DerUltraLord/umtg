// @ts-ignore
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'
import 'bootstrap';
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import router from './router';


//import VModal from 'vue-js-modal';
import BootstrapVue from 'bootstrap-vue';
import App from './components/App.vue';

import storeDefinition from './store/store';
const sms = require('source-map-support');

Vue.use(require('vuex'));
Vue.use(require('vue-shortkey'));
Vue.use(Vuetify);
Vue.use(VueRouter)
//Vue.use(VModal);
Vue.use(BootstrapVue);

const store: any = new Vuex.Store(storeDefinition);

//console.log(store.getters.settings);

//let Events = new Vue();

declare var __static: string;

(<any>window).__staticOffset = '';
if (process.env.NODE_ENV !== 'development') {
    // NOTE: dirty hack for static folder in production mode
    (<any>window).__staticOffset = '../static/';
}




let myApp = new Vue({
    el: '#app',
    store: store,
    router,
    template: '<App/>',
    components: { App }
});
window.App = myApp;
