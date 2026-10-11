import { defineStore } from 'pinia';
import { useApi } from '@/composables/useApi';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;
      const { fetchWithAuth } = useApi();
      try {
        const response = await fetchWithAuth<{ token: string }>('/auth/login', {
          method: 'POST',
          body: { username, password },
        });
        
        const token = useCookie('auth_token');
        token.value = response.token;
        this.isAuthenticated = true;
        
      } catch (err: any) {
        const msg = err.data?.message;
        this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Invalid username or password');
        this.isAuthenticated = false;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchProfile() {
      if (!this.isAuthenticated) return;
      const { fetchWithAuth } = useApi();
      try {
        const response = await fetchWithAuth<any>('/pilot/me');
        this.user = response;
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    },
    
    logout() {
      const token = useCookie('auth_token');
      token.value = null;
      this.user = null;
      this.isAuthenticated = false;
    }
  }
});
