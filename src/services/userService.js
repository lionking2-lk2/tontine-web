import api from "../api/axios";

export const getMe = () => api.get("/users/me/");

export const updateMe = (data) => api.patch("/users/me/", data);

export const changePassword = (data) =>
    api.post("/users/change-password/", data);
