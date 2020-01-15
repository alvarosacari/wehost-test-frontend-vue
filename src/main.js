import Vue from 'vue'
import App from './App.vue'
import {router} from './_routes'
import {store} from './_store'
import '@/plugins/vueMoment'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
