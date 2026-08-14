import api from "../api/axios";

export const getNotifications = () => {
    return api.get("/notifications/");
};

export const markAsRead = (id) => {
    return api.patch(`/notifications/${id}/`, { statutLecture: "LUE" });
};

export const marquerCommeLue = (notifId) => {
    return api.patch(`/notifications/${notifId}/`, { statutLecture: "LUE" });
};