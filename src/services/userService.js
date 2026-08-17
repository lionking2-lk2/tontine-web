import api from "../api/axios";

export const getMe = () => {
    return api.get("/users/me/");
};

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