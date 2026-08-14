import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Ajoute automatiquement le token uniquement
// aux requêtes qui nécessitent une authentification
api.interceptors.request.use((config) => {
    const publicRoutes = [
        "/users/register/",
        "/users/login-metier/",
        "/users/verify-otp/",
        "/users/forgot-password/",
        "/users/reset-password/",
    ];

    const isPublicRoute = publicRoutes.some(
        (route) => config.url?.endsWith(route)
    );

    if (!isPublicRoute) {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
    }

    return config;
});

export default api;