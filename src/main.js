import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

// Vant 全局样式
import 'vant/lib/index.css'
// Leaflet 样式
import 'leaflet/dist/leaflet.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
