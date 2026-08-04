import api from "../api/axios";


export const getGroupes = async () => {
    const response = await api.get("groups/");
    return response.data;
};
