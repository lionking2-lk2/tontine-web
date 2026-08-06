import "./Services.css";

function Services() {
  return (
    <section className="services">

      <div className="title">

        <h2>Nos Services</h2>

        <p>
          Une plateforme complète pour gérer vos finances
          où que vous soyez.
        </p>

      </div>

      <div className="services-grid">

        <div className="service-card">

          <div className="icon">💰</div>

          <h3>Épargne</h3>

          <p>
            Constituez votre épargne en toute sécurité et
            suivez son évolution.
          </p>

        </div>

        <div className="service-card">

          <div className="icon">📄</div>

          <h3>Prêts</h3>

          <p>
            Effectuez vos demandes de prêts directement
            depuis votre espace client.
          </p>

        </div>

        <div className="service-card">

          <div className="icon">📊</div>

          <h3>Suivi Financier</h3>

          <p>
            Consultez votre historique et vos transactions
            en temps réel.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Services;