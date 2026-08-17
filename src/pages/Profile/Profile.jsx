import { useEffect, useState } from "react";import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import { getMe, submitKyc, getKyc } from "../../services/userService";import "./Profile.css";

const Profile = () => {
  const { user: initialUser, loading } = useUser();

  const [user, setUser] = useState(initialUser);
  const [showKycForm, setShowKycForm] = useState(false);

  const [typePiece, setTypePiece] = useState("");
  const [fichierPiece, setFichierPiece] = useState(null);

  const [typeJustificatifDomicile, setTypeJustificatifDomicile] = useState("");
  const [fichierJustificatif, setFichierJustificatif] = useState(null);

  const [submittingKyc, setSubmittingKyc] = useState(false);
  const [kycMessage, setKycMessage] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [kycError, setKycError] = useState("");

  useEffect(() => {
    setUser(initialUser);
}, [initialUser]);

useEffect(() => {
  const fetchKycStatus = async () => {
    try {
      const response = await getKyc();

      const documents = response.data || [];

      if (documents.length > 0) {
        setKycStatus(documents[0].statutValidation);
      } else {
        setKycStatus(null);
      }
    } catch (error) {
      console.error("Erreur récupération KYC :", error);
      setKycStatus(null);
    }
  };

  fetchKycStatus();
}, []);

  if (loading) {
    return (
      <main className="profile-content">
        <p className="profile-status">Chargement de votre profil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="profile-content">
        <p className="profile-status profile-error">
          Impossible de charger votre profil.
        </p>
      </main>
    );
  }

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.username ||
    "Utilisateur";

  const initials =
    `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
    user.username?.[0]?.toUpperCase() ||
    "U";

  const handleKycSubmit = async (event) => {
    event.preventDefault();

    setKycMessage("");
    setKycError("");

    if (!typePiece) {
      setKycError("Veuillez sélectionner le type de pièce d'identité.");
      return;
    }

    if (!fichierPiece) {
      setKycError("Veuillez sélectionner votre pièce d'identité.");
      return;
    }

    setSubmittingKyc(true);

    try {
      const formData = new FormData();

      formData.append("typePiece", typePiece);
      formData.append("fichierPiece", fichierPiece);

      if (typeJustificatifDomicile) {
        formData.append(
          "typeJustificatifDomicile",
          typeJustificatifDomicile
        );
      }

      if (fichierJustificatif) {
        formData.append("fichierJustificatif", fichierJustificatif);
      }

      await submitKyc(formData);

      setKycMessage(
        "Votre demande de vérification a été envoyée. Elle est en attente de validation."
      );

      setShowKycForm(false);

      setTypePiece("");
      setFichierPiece(null);
      setTypeJustificatifDomicile("");
      setFichierJustificatif(null);

      const response = await getMe();
      setUser(response.data);
    } catch (error) {
      const responseData = error?.response?.data;

      if (typeof responseData === "string") {
        setKycError(responseData);
      } else if (responseData?.detail) {
        setKycError(responseData.detail);
      } else {
        setKycError(
          "Impossible d'envoyer votre demande. Vérifiez les informations et réessayez."
        );
      }
    } finally {
      setSubmittingKyc(false);
    }
  };

  return (
    <main className="profile-content">
      <div className="profile-title">
        <h1>Mon profil</h1>
        <p>Consultez les informations de votre compte.</p>
      </div>

      <section className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>

          <div className="profile-identity">
            <h2>{fullName}</h2>
            <p>@{user.username}</p>

            <span
              className={`profile-account-status ${
                user.statut_compte === "ACTIF" ? "active" : "inactive"
              }`}
            >
              <FaCheckCircle />
              {user.statut_compte || "Statut inconnu"}
            </span>
          </div>
        </div>

        <div className="profile-section">
          <h3>Informations personnelles</h3>

          <div className="profile-grid">
            <div className="profile-info">
              <div className="profile-info-icon">
                <FaUser />
              </div>

              <div>
                <span>Nom d'utilisateur</span>
                <strong>{user.username || "Non renseigné"}</strong>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-info-icon">
                <FaUser />
              </div>

              <div>
                <span>Nom complet</span>
                <strong>{fullName}</strong>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-info-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>Adresse e-mail</span>
                <strong>{user.email || "Non renseignée"}</strong>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-info-icon">
                <FaPhone />
              </div>

              <div>
                <span>Numéro de téléphone</span>
                <strong>{user.phone || "Non renseigné"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section profile-security">
          <h3>État du compte</h3>

          <div className="profile-account-info">
            <div className="profile-info-icon">
              <FaShieldAlt />
            </div>

            <div className="profile-account-details">
              <span>Vérification d'identité</span>

              <strong>
  {user.a_kyc_valide
    ? "Identité vérifiée"
    : kycStatus === "EN_ATTENTE"
      ? "Vérification en cours"
      : kycStatus === "REFUSE"
        ? "Vérification refusée"
        : "Identité non renseignée"}
</strong>

              {!user.a_kyc_valide && kycStatus !== "EN_ATTENTE" && (
  <button
    type="button"
    className="kyc-button"
    onClick={() => {
      setKycMessage("");
      setKycError("");
      setShowKycForm(!showKycForm);
    }}
  >
    {kycStatus === "REFUSE"
      ? "Corriger mes données d'identité"
      : showKycForm
        ? "Fermer le formulaire"
        : "Renseigner mes données d'identité"}
  </button>
)}
            </div>
          </div>

          {kycMessage && (
            <div className="kyc-success">
              {kycMessage}
            </div>
          )}

          {kycError && (
            <div className="kyc-error">
              {kycError}
            </div>
          )}

          {showKycForm && !user.a_kyc_valide && (
  <div className="kyc-modal-overlay">
    <div className="kyc-modal">

      <div className="kyc-modal-header">
        <div>
          <h4>Renseigner mes données d'identité</h4>
          <p>
            Ces informations permettront de vérifier votre identité.
          </p>
        </div>

        <button
          type="button"
          className="kyc-close-button"
          onClick={() => setShowKycForm(false)}
          disabled={submittingKyc}
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleKycSubmit}>

        <div className="kyc-field">
          <label htmlFor="typePiece">
            Type de pièce d'identité *
          </label>

          <select
            id="typePiece"
            value={typePiece}
            onChange={(event) => setTypePiece(event.target.value)}
            disabled={submittingKyc}
          >
            <option value="">Sélectionner</option>
            <option value="CNI">
              Carte nationale d'identité
            </option>
            <option value="PASSEPORT">
              Passeport
            </option>
            <option value="CARTE_SEJOUR">
              Carte de séjour
            </option>
          </select>
        </div>

        <div className="kyc-field">
          <label htmlFor="fichierPiece">
            Pièce d'identité *
          </label>

          <input
            id="fichierPiece"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(event) =>
              setFichierPiece(event.target.files?.[0] || null)
            }
            disabled={submittingKyc}
          />
        </div>

        <div className="kyc-field">
          <label htmlFor="typeJustificatifDomicile">
            Type de justificatif de domicile
          </label>

          <select
            id="typeJustificatifDomicile"
            value={typeJustificatifDomicile}
            onChange={(event) =>
              setTypeJustificatifDomicile(event.target.value)
            }
            disabled={submittingKyc}
          >
            <option value="">Aucun</option>
            <option value="FACTURE_ELECTRICITE">
              Facture d'électricité
            </option>
            <option value="FACTURE_EAU">
              Facture d'eau
            </option>
            <option value="FACTURE_TELEPHONE">
              Facture de téléphone
            </option>
            <option value="ATTESTATION_DOMICILE">
              Attestation de domicile
            </option>
          </select>
        </div>

        <div className="kyc-field">
          <label htmlFor="fichierJustificatif">
            Justificatif de domicile
          </label>

          <input
            id="fichierJustificatif"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(event) =>
              setFichierJustificatif(
                event.target.files?.[0] || null
              )
            }
            disabled={submittingKyc}
          />
        </div>

        {kycError && (
          <div className="kyc-error">
            {kycError}
          </div>
        )}

        <div className="kyc-actions">
          <button
            type="button"
            className="kyc-cancel-button"
            onClick={() => setShowKycForm(false)}
            disabled={submittingKyc}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="kyc-submit-button"
            disabled={submittingKyc}
          >
            {submittingKyc
              ? "Envoi en cours..."
              : "Envoyer pour vérification"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}
        </div>
      </section>
    </main>
  );
};

export default Profile;