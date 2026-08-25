import api from "../api/axios";

// Mes groupes + soldes agrégés (dashboard)
export const getMesGroupesEtSoldes = () => api.get("/groups/mes/");

// Mes tontines (liste simple)
export const getMesTontines = () => api.get("/groups/membres/?mine=true");

// Créer un groupe
export const creerGroupe = (data) => api.post("/groups/", data);

// Configurer une tontine rotative
export const configurerRotative = (groupeId, data) =>
    api.patch(`/groups/${groupeId}/configurer/`, data);

// Configurer une tontine épargne-crédit
export const configurerEpargneCredit = (groupeId, data) =>
    api.patch(`/groups/${groupeId}/regles/`, data);

// Détail d'un groupe
export const getGroupe = (groupeId) => api.get(`/groups/${groupeId}/`);

// Membres d'un groupe
export const getMembresGroupe = (groupeId) =>
    api.get(`/groups/membres/?groupe=${groupeId}`);

// Validateurs d'un groupe
export const getValidateursGroupe = (groupeId) =>
    api.get(`/groups/validateurs/?groupe=${groupeId}`);

// Cotisations d'un groupe
export const getCotisationsGroupe = (groupeId) =>
    api.get(`/groups/cotisations/?groupe=${groupeId}`);

// Statistiques d'un groupe
export const getStatistiquesGroupe = (groupeId) =>
    api.get(`/groups/${groupeId}/statistiques/`);

// Demandes d'adhésion en attente (gestionnaire / validateur)
export const getDemandesAdhesion = () => api.get("/groups/demandes/");

// Inviter un membre dans un groupe
export const inviterMembre = (groupeId, identifiant) =>
    api.post(`/groups/${groupeId}/inviter/`, { identifiant });

// Mes invitations reçues
export const getMesInvitations = () =>
    api.get("/groups/demandes/mes-invitations/");

// Répondre à une invitation (accepter / refuser)
export const repondreInvitation = (demandeId, action) =>
    api.post(`/groups/demandes/${demandeId}/repondre/`, { action });

// Demander à rejoindre un groupe
export const demanderAdhesion = (groupeId) =>
    api.post(`/groups/${groupeId}/demander-adhesion/`);

// Traiter une demande d'adhésion (gestionnaire)
export const traiterDemandeAdhesion = (demandeId, action) =>
    api.post(`/groups/demandes/${demandeId}/traiter/`, { action });

// Moyens de paiement actifs
export const getMoyensPaiement = () =>
    api.get("/platform/payment-methods/actifs/");

// Payer une cotisation
export const payerCotisation = (data) => api.post("/groups/cotisations/", data);

// Quitter un groupe (UC09 / UC17)
export const quitterGroupe = (groupeId) =>
    api.post(`/groups/${groupeId}/quitter/`);

// Modérer un membre (suspendre / rétablir / exclure)
export const modererMembre = (membreId, data) =>
    api.post(`/groups/membres/${membreId}/moderer/`, data);

// Ordre des tours (tontine rotative)
export const getOrdreTours = (groupeId) =>
    api.get(`/groups/${groupeId}/ordre-tours/`);

// Marquer un tour comme reçu
export const marquerTourRecu = (groupeId, membrePk) =>
    api.post(`/groups/${groupeId}/ordre-tours/${membrePk}/marquer-recu/`);

// Désigner un validateur (UC08 — 3 clés)
export const designerValidateur = (data) =>
    api.post("/groups/validateurs/", data);

// Retirer un validateur
export const supprimerValidateur = (validateurId) =>
    api.delete(`/groups/validateurs/${validateurId}/`);

// Tous les groupes (recherche / rejoindre)
export const getTousLesGroupes = () => api.get("/groups/");

// Signaler un groupe
export const signalerGroupe = (groupeId, data) =>
    api.post(`/groups/${groupeId}/signaler/`, data);

// Demandes de prêt à approuver (alias pour GestionPrets)
export const getDemandesPretListe = () => api.get("/loans/demandes-a-approuver/");
