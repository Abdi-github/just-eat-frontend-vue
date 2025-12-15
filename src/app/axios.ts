import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4005/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor — attach auth token + language
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('just_eat_token');
  const lang = localStorage.getItem('just_eat_lang') || 'en';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Accept-Language'] = lang;

  return config;
});

// Response interceptor — handle 401 with token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('just_eat_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${apiClient.defaults.baseURL}/public/auth/refresh`,
            { refresh_token: refreshToken },
          );
          const { access_token, refresh_token } = res.data.data;

          localStorage.setItem('just_eat_token', access_token);
          localStorage.setItem('just_eat_refresh_token', refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('just_eat_token');
          localStorage.removeItem('just_eat_refresh_token');
          localStorage.removeItem('just_eat_user');
          const lang = localStorage.getItem('just_eat_lang') || 'en';
          window.location.href = `/${lang}/login`;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
export { apiClient as api };
