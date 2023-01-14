import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'

import './assets/app.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const updateSW = registerSW({
  onOfflineReady() {},
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, 5 * 1000)
  }
})

app.mount('#app')
