import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Routes qui ne doivent jamais porter de token,
// même si un vieux token traîne
const ROUTES_PUBLIQUES = [
    "/users/register/",
    "/users/login/",
    "/users/login-metier/",
    "/users/verify-otp/",
    "/users/resend-otp/",
    "/users/forgot-password/",
    "/users/reset-password/",
    "/users/auth/google/",
    "/users/auth/supabase/",
];

api.interceptors.request.use((config) => {
    const estRoutePublique = ROUTES_PUBLIQUES.some((route) =>
        config.url?.startsWith(route)
    );

    if (!estRoutePublique) {
        const token = localStorage.getItem("token");
        console.log("Token utilisé par Axios :", token ? "TOKEN TROUVÉ" : "AUCUN TOKEN");

        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
    }

    return config;
});

export default api;