import axios from "axios";
import AuthService from "./services/auth.service";

let api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
});


api.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser();
        //...
        if(user?.access_token){
          config.headers.Authorization = `Bearer ${user.access_token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //unauthorized
    if (error.response.status === 401) {
      // No refresh token available, log out the user
      AuthService.logout();
      window.location.href = '/'; // Redirect to login
    }

    // If the error is 403 Unauthorized and it's not a retry attempt
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops

      const refreshToken = AuthService.getRefreshToken();

      if (refreshToken) {
        try {
          originalRequest.headers.Authorization = `Bearer ${refreshToken}`; // Update header

          return api(originalRequest); // Retry the original request
        } catch (refreshError) {
          // Refresh token failed, log out the user
          AuthService.logout();
          window.location.href = '/'; // Redirect to login
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, log out the user
        AuthService.logout();
        window.location.href = '/'; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;