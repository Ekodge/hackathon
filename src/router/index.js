import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import MapPage from '../views/MapPage.vue';
import LoginView from '../views/LoginView.vue';
import DetailsView from '../views/DetailsView.vue'; 
import EditShop from '../views/EditShop.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/map', name: 'Map', component: MapPage },
  { path: '/:id_:name', name: 'Details', component: DetailsView },
  { path: '/edit-shop', name: 'EditShop', component: EditShop }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
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
