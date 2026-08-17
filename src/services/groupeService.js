import api from "../api/axios";

export const getMesGroupesEtSoldes = () => {
    return api.get("/groups/mes/");
};

export const getMesTontines = () => {
    return api.get("/groups/membres/?mine=true");
};

export const creerGroupe = (data) => {
    return api.post("/groups/", data);
};

export const configurerRotative = (groupeId, data) => {
    return api.patch(`/groups/${groupeId}/configurer/`, data);
};

export const configurerEpargneCredit = (groupeId, data) => {
    return api.patch(`/groups/${groupeId}/regles/`, data);
};

export const getGroupe = (groupeId) => {
    return api.get(`/groups/${groupeId}/`);
};

export const getMembresGroupe = (groupeId) => {
    return api.get(`/groups/membres/?groupe=${groupeId}`);
};

export const getValidateursGroupe = (groupeId) => {
    return api.get(`/groups/validateurs/?groupe=${groupeId}`);
};

export const getCotisationsGroupe = (groupeId) => {
    return api.get(`/groups/cotisations/?groupe=${groupeId}`);
};

export const getStatistiquesGroupe = (groupeId) => {
    return api.get(`/groups/${groupeId}/statistiques/`);
};

export const getDemandesAdhesion = () => {
    return api.get(`/groups/demandes/`);
};

export const getMesDemandesPret = () => {
    return api.get("/loans/demandes/");
};

export const creerDemandePret = (data) => {
    return api.post("/loans/demandes/creer/", data);
};

export const inviterMembre = (groupeId, identifiant) => {
    return api.post(`/groups/${groupeId}/inviter/`, { identifiant });
};

export const getMesInvitations = () => {
    return api.get("/groups/demandes/mes-invitations/");
};

export const repondreInvitation = (demandeId, action) => {
    return api.post(`/groups/demandes/${demandeId}/repondre/`, { action });
};