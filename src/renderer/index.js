import 'bootstrap/dist/css/bootstrap.css'
import 'open-iconic/font/css/open-iconic-bootstrap.css'
import 'bootstrap'
import Vue from 'vue'
import App from './App.vue'

import Model from '../main/model.js'
console.log("Load model ...");
let initialization = Model.init('test.db')
console.log("Model loaded");

let Events = new Vue()

Object.defineProperties(Vue.prototype, {
    Events: {
        get: function() {
            return Events
        }
    }
})


initialization.then(() => {
    new Vue({
            el: '#app',
            template: '<App/>',
            components: { App }

    })
})
.catch(console.error);
