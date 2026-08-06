# Guide Frontend — PTontine (Web Client)

Ce fichier cadre le travail frontend du binôme **Web Client** (A2 + B2).
Il doit rester à la racine du projet `tontine-web` et être tenu à jour.

## ⚠️ Dossier à ignorer

Le dossier `frontend/` (ancien prototype HTML/JS statique) **n'a plus aucun
rapport avec ce projet**. Ne pas le lire, ne pas s'en inspirer, ne pas y
toucher. Tout le travail se fait exclusivement dans `tontine-web/` (React +
Vite + Axios).

## Palette de couleurs officielle

| Usage | Couleur | Code |
|---|---|---|
| Vert (actions principales : Créer, Valider, Confirmer) | Vert | `#16a34a` |
| Bleu (navigation, informations, liens) | Bleu | `#2563eb` |
| Blanc (arrière-plan, cartes) | Blanc | `#ffffff` |
| Gris clair (fond général) | Gris | `#f5f7fa` |

À définir dans `src/index.css` :
```css
:root {
  --vert: #16a34a;
  --bleu: #2563eb;
  --blanc: #ffffff;
  --gris: #f5f7fa;
}
```

## Base API

Toutes les requêtes passent par `src/api/axios.js`, avec pour base URL :
```
http://127.0.0.1:8000/api/v1/
```
Authentification : `TokenAuthentication` DRF classique.
Header requis sur les routes protégées : `Authorization: Token <clé>`
(pas de `Bearer`, pas de JWT — l'équipe a tranché pour `Token` sur ce projet).

## Répartition des tâches

### 👤 Personne A2 — Zone "Groupes"

Écrans à construire, branchés sur les endpoints déjà fonctionnels côté API :

| Écran | Endpoint(s) | UC |
|---|---|---|
| Créer un groupe | `POST /groups/` | UC03 |
| Choisir le type de groupe | `PATCH /groups/{id}/configurer/` | UC04 |
| Définir les règles du groupe | `PATCH /groups/{id}/regles/` | UC05 |
| Inviter des membres | `POST /groups/{id}/invitations/`, `GET /groups/{id}/invitations/` | UC06 |
| Liste des demandes d'adhésion + voter | `GET /groups/demandes/`, `POST /groups/demandes/{id}/voter/` | UC07 |
| Quitter un groupe | `POST /groups/{id}/quitter/` | UC17 |

> **Note API (vérifiée le 2026-08-05)** — écarts connus entre le guide UC et
> l'API actuelle (`API_3_KEYS/groups/urls.py`) :
>
> - **UC07** : l'API expose `POST /groups/demandes/{id}/traiter/` avec body
>   `{ "action": "accepter" | "refuser" }` (modération, UC20). Le flux « voter
>   en tant que membre » (`/voter/`) n'est pas encore routé.
> - **UC06 / UC17** : routes `invitations/` et `quitter/` absentes de l'API
>   pour l'instant — à valider avec l'équipe API avant intégration React.

### 👤 Personne B2 — Zone "Financier"

| Écran | Endpoint(s) | UC |
|---|---|---|
| Consulter son solde | `GET /groups/{groupe_id}/solde/` | UC11 |
| Historique des opérations | `GET /loans/historique/` | UC12 |
| Demander un prêt | `POST /loans/demandes/creer/` | UC13 |
| Statistiques du groupe | `GET /groups/{groupe_id}/statistiques/` | UC21 |

> Endpoints confirmés dans `API_3_KEYS/groups/urls.py` et `API_3_KEYS/loans/urls.py`.

### 🤝 Commun aux deux (à négocier qui commence)

- **Page d'accueil / Dashboard connecté** : agrège les infos des deux zones
  (nom, groupes du membre, aperçu solde). Se construit une fois que les deux
  zones ont au moins un endpoint prêt à consommer.
- **Navbar** et navigation générale de l'app.
- **Layout global** (couleurs, structure de page, composants partagés comme
  boutons, cartes).

## Authentification déjà branchée

Les écrans suivants existent déjà et fonctionnent, à réutiliser tels quels
(ne pas refaire) :
- Inscription (email et/ou téléphone)
- Connexion
- Mot de passe oublié / réinitialisation
- Vérification OTP

> **État actuel (2026-08-05)** : l'API expose `POST /users/register/` et
> `POST /users/login/` (token DRF). Les pages React correspondantes ne sont
> pas encore présentes dans `tontine-web/src/` — branche active :
> `feature/frontend-api-connexion`.

## Règle de collaboration

- 1 branche par écran/fonctionnalité, jamais de travail direct sur `main`.
- Avant de commit : vérifier `git status` pour ne jamais inclure le dossier
  `frontend/` (ancien prototype, non suivi, à ignorer).
- Toute nouvelle route API utilisée doit être vérifiée avec un `curl` ou
  Postman avant intégration React, pour ne pas déboguer les deux couches en
  même temps.

## État du dépôt frontend

| Élément | Fichier | Statut |
|---|---|---|
| Client Axios + base URL | `src/api/axios.js` | OK |
| Variables CSS palette | `src/index.css` | Partiel (palette ajoutée, styles Vite template encore présents) |
| Navbar | `src/components/Navbar.jsx` | Squelette |
| Accueil | `src/pages/Home.jsx` | Squelette |
| Dashboard | `src/pages/Dashboard.jsx` | Squelette (`GET /groups/` via `groupeService.js`) |
| Router React | — | Non configuré (`react-router-dom` installé, non utilisé dans `App.jsx`) |
| Intercepteur Token | `src/api/axios.js` | À ajouter après écran connexion |
