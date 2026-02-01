import { createApp } from 'vue'
import App from './App.vue'
import './assets/base.css'
import pinia from './pinia'
import router from './router'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
