import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'

import './assets/app.css'
import { holdDirective } from './directives/hold'
import { dragDirective } from './directives/drag'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.directive('hold', holdDirective)
app.directive('drag', dragDirective)

const updateSW = registerSW({
  onOfflineReady() {},
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, 5 * 1000)
  }
})

app.mount('#app')
