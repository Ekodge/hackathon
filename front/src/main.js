import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

createApp(App).use(router).mount('#app')


// pour build :

// npm run build  
// npx cap sync 
// npx cap open android