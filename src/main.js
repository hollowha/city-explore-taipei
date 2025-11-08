import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './router/index.js';
import App from './App.vue';
import './styles.css';
import 'leaflet/dist/leaflet.css';

const app = createApp(App);

const router = createRouter({
  history: createWebHistory('/'), // Use root path in dev
  routes,
  scrollBehavior() { return { top: 0 }; }
});

app.use(router);
app.mount('#app');
