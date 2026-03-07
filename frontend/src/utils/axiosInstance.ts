import axios from "axios";

const axiosInstance = axios.create();

let isRefreshing = false;

// Routes where a 401 means "not logged in" — don't attempt refresh
const skipRefreshRoutes = ["/auth/me", "/auth/refresh"];

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        const isSkipped = skipRefreshRoutes.some((route) => original.url?.includes(route));

        if (error.response?.status === 401 && !original._retry && !isSkipped) {
            if (isRefreshing) return Promise.reject(error);
            original._retry = true;
            isRefreshing = true;
            try {
                await axios.post("/auth/refresh", {}, { withCredentials: true });
                isRefreshing = false;
                return axiosInstance(original);
            } catch {
                isRefreshing = false;
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
