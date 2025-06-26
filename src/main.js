import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Import the refactored store object

Vue.config.productionTip = false

// Make the reactive store object accessible in all components
Vue.prototype.$store = store;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
