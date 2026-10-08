import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

let setAccessToken = null;

export const setAccessTokenUpdater = (setter) => {
  setAccessToken = setter;
};

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/rotate-token")
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.get("/auth/rotate-token");

        const newAccessToken = response.data.data.accessToken;

        // Update AuthContext
        if (setAccessToken) {
          setAccessToken(newAccessToken);
        }

        // Put new token into the failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("token refreshed");

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.log("error :", error);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
