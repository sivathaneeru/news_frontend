import Vue from 'vue'
import App from './App.vue'
import router from './router' // Will be created in a subsequent step
import store from './store' // Will be created in a subsequent step

Vue.config.productionTip = false

// Make store accessible in all components
Vue.prototype.$store = store;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
