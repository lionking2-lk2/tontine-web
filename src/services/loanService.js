import api from "../api/axios";

export const getHistorique = () => {
    return api.get("/loans/historique/");
};