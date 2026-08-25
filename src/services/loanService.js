import api from "../api/axios";

// Historique simple (legacy)
export const getHistorique = () => api.get("/loans/historique/");

// Mes demandes de prêt
export const getMesDemandesPret = () => api.get("/loans/demandes/");

// Créer une demande de prêt
export const creerDemandePret = (data) => api.post("/loans/demandes/creer/", data);

// Historique des remboursements pour un groupe (legacy)
export const getHistoriqueRemboursements = (groupeId) =>
    api.get(`/loans/historique/?type=Remboursement&groupe=${groupeId}`);

// Demandes de prêt d'un groupe (pour les validateurs / gestionnaires)
export const getDemandesPretGroupe = () => api.get("/loans/demandes/");

// Voter sur une demande de prêt (UC16 — validateur)
export const voterDemandePret = (demandeId, decision) =>
    api.post(`/loans/demandes/${demandeId}/voter/`, { decision });

// Demandes à approuver (UC15 — validateurs + gestionnaire)
export const getDemandesAApprouver = () => api.get("/loans/demandes-a-approuver/");

// Détail d'une demande de prêt
export const getDetailDemandePret = (id) => api.get(`/loans/demandes/${id}/`);

// Enregistrer une décision d'examen (UC14 — gestionnaire)
export const enregistrerDecisionExamen = (id, data) =>
    api.post(`/loans/demandes/${id}/decision/`, data);

// Approuver définitivement un prêt (UC15)
export const approuverDemandePret = (id) =>
    api.post(`/loans/demandes/${id}/approuver/`);

// Refuser une demande de prêt (UC16)
export const refuserDemandePret = (id, data) =>
    api.post(`/loans/demandes/${id}/refuser/`, data);

// Historique des transactions avec filtres — supporte { groupe, type, date_debut, date_fin }
// ou un groupeId direct (compat legacy)
export const getHistoriqueTransactions = (params = {}) => {
    if (typeof params !== "object" || params === null) {
        // Appel legacy : getHistoriqueTransactions(groupeId)
        const groupeId = params;
        return api.get(`/loans/historique/${groupeId ? `?groupe=${groupeId}` : ""}`);
    }
    const query = new URLSearchParams(params).toString();
    return api.get(`/loans/historique/${query ? "?" + query : ""}`);
};

// Alias pour la page GestionPrets
export const getDemandesPretAExaminer = () => api.get("/loans/demandes/");

// Échéances d'un prêt
export const getEcheancesPret = () => api.get("/loans/historique/?type=Remboursement");
