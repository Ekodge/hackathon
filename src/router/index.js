import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import MapPage from '../views/MapPage.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/map', name: 'Map', component: MapPage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Redirection pour les utilisateurs non authentifiés
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
