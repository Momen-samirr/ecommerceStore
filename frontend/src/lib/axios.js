import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development" ? "http://node-api:5000/api" : "/api",
  withCredentials: true,
});

console.log(import.meta.env.VITE_API_BASE_URL);

export default axiosInstance;
