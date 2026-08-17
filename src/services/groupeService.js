import api from "../api/axios";

export const getMesGroupesEtSoldes = () => {
    return api.get("/groups/mes/");
};