import api from "../api/axios";

export const register = (data) => {
    return api.post("/users/register/", data);
};

export const login = (data) => {
    return api.post("/users/login-metier/", data);
};

export const verifyOtp = (data) => {
    return api.post("/users/verify-otp/", data);
};

export const forgotPassword = (data) => {
    return api.post("/users/forgot-password/", data);
};

export const resetPassword = (data) => {
    return api.post("/users/reset-password/", data);
};