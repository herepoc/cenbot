import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from './App.vue';
import ChatView from './views/ChatView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ChatView
    }
  ]
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');