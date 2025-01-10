import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import * as BootstrapVueNext from 'bootstrap-vue-next';

const app = createApp(App)

app.config.globalProperties.$apiRoute = 'https://royalgujarati.com/member_trainers/api';

app.use(router,BootstrapVueNext)
app.mount('#app')
