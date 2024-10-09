import axios from 'axios';

// Set axios as a global variable
(window as any).axios = axios;

// Change to the URL of your backend
// Get the Backend URI from the .env file
axios.defaults.baseURL = 'https://student-discipline-api-fmm2.onrender.com';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

export const setupAxiosInterceptors = (token: string) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

