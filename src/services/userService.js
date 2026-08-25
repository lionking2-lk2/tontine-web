import api from "../api/axios";

export const getMe = () => api.get("/users/me/");

export const updateMe = (data) => api.patch("/users/me/", data);

export const changePassword = (data) =>
    api.post("/users/change-password/", data);

export const submitKyc = (formData) => {
    return api.post("/users/kyc/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getKyc = () => {
    return api.get("/users/kyc/");
};