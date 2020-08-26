// =========================================================
// * Vuetify Material Dashboard PRO - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import './plugins/vue-world-map'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import IdleVue from 'idle-vue'
import VueFriendlyIframe from 'vue-friendly-iframe';
import VueSocketIO from 'vue-socket.io'
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import VueTheMask from 'vue-the-mask'
// import { VueReCaptcha } from 'vue-recaptcha-v3'

import { BASE_API } from './api.js'

Vue.config.productionTip = false

// Vue.use(new VueSocketIO({
//     debug: true,
//     connection: `${BASE_API}/notification`, //options object is Optional
//     vuex: {
//       store,
//       actionPrefix: 'SOCKET_',
//         mutationPrefix: 'SOCKET_',
//       options: {
//         useConnectionNamespace: true
// 	  }
//     }
//   })
// );

const eventsHub = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')

Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  idleTime: 15*60*1000, // 15 mins  15*60*1000 = 900000
  startAtIdle: false
});

Vue.use(VueFriendlyIframe);
Vue.use(require('vue-moment'));

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

Vue.use(VueTheMask)

// Vue.use(VueReCaptcha, { 
//   siteKey: '6LfHcsMZAAAAAHRcmTO_pr3zBAUeTLCbUnG2aUwm',
//   loaderOptions: {
//     useRecaptchaNet: true
//   }
// })


// export const SocketInstance = socketio(`${BASE_API}/notification`);

// Vue.use(VueSocketIO, SocketInstance)
// Vue.use(VueSocketIO, `${BASE_API}/notification`, store);
