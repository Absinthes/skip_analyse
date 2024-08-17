import axios from "axios";

export const request = axios.create({
  baseURL: "/api",
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.warn(error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    console.warn(error);
    return Promise.reject(error);
  }
);
