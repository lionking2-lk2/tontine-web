import "./Compte.css";

const Compte = () => {
  return (
    <div className="compte-page">
      <div className="compte-header">
        <h1>Mon compte</h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <section className="compte-card">
        <div className="compte-section">
          <h2>Informations personnelles</h2>

          <div className="compte-field">
            <span>Nom et prénom</span>
            <strong>À récupérer depuis votre profil</strong>
          </div>

          <div className="compte-field">
            <span>Adresse e-mail</span>
            <strong>À récupérer depuis votre compte</strong>
          </div>

          <div className="compte-field">
            <span>Numéro de téléphone</span>
            <strong>À récupérer depuis votre compte</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Compte;