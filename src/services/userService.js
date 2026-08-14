import api from "../api/axios";

export const getMe = () => {
    return api.get("/users/me/");
};