import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token');
  const authStore = useAuthStore();

  if (token.value) {
    authStore.isAuthenticated = true;
  }

  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/');
  }
});
