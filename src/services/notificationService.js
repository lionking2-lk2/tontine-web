import api from "../api/axios";

export const getNotifications = () => {
    return api.get("/notifications/");
};

export const markAsRead = (id) => {
    return api.patch(`/notifications/${id}/`, {});
};