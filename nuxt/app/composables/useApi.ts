export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie('auth_token');

  const fetchWithAuth = async <T>(endpoint: string, options: any = {}) => {
    const headers = {
      ...options.headers,
    };

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`;
    }

    try {
      const response = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers,
      });
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        token.value = null;
        navigateTo('/login');
      }
      throw error;
    }
  };

  return { fetchWithAuth };
};
