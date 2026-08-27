import api from "../api/axios";

export const getHistorique = () => {
    return api.get("/loans/historique/");
};

export const getMesDemandesPret = () => {
    return api.get("/loans/demandes/");
};

export const creerDemandePret = (data) => {
    return api.post("/loans/demandes/creer/", data);
};

export const getHistoriqueRemboursements = (groupeId) => {
    return api.get(`/loans/historique/?type=Remboursement&groupe=${groupeId}`);
};

export const getDemandesPretGroupe = (groupeNom) => {
    return api.get(`/loans/demandes/`);
};

export const voterDemandePret = (demandeId, decision) => {
    return api.post(`/loans/demandes/${demandeId}/voter/`, { decision });
};