import { Info, Shield, Code, ExternalLink, Heart, Globe } from "lucide-react";

const APropos = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    {/* Identité de l'application */}
    <div style={{
      display: "flex", alignItems: "center", gap: "20px",
      padding: "24px", borderRadius: "var(--radius-lg)",
      background: "var(--slate-900)", color: "var(--blanc)"
    }}>
      <div style={{
        width: "60px", height: "60px", borderRadius: "var(--radius-md)",
        background: "var(--vert)", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, fontSize: "28px"
      }}>
        🔑
      </div>
      <div>
        <h2 style={{ fontSize: "20px", color: "var(--blanc)", marginBottom: "4px" }}>
          Trois Clés — PTontine
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0 }}>
          Plateforme de gestion de tontines numérique
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          marginTop: "10px", padding: "4px 10px",
          background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-full)",
          fontSize: "12px", color: "rgba(255,255,255,0.75)"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--vert)", display: "inline-block" }} />
          Version 1.0.0
        </div>
      </div>
    </div>

    {/* Description */}
    <div style={{
      padding: "20px", borderRadius: "var(--radius-md)",
      background: "var(--bleu-bg)", border: "1px solid var(--bleu-border)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <Info size={16} color="var(--bleu)" />
        <strong style={{ fontSize: "14px", color: "var(--bleu)" }}>À propos de l'application</strong>
      </div>
      <p style={{ fontSize: "13px", color: "var(--slate-600)", lineHeight: 1.7, margin: 0 }}>
        PTontine est une solution numérique conçue pour simplifier la gestion des tontines
        en Afrique de l'Ouest. Elle permet de gérer les cotisations, les prêts entre membres,
        les tours de bénéfice et la communication au sein des groupes d'épargne.
      </p>
    </div>

    {/* Fonctionnalités clés */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {[
        { icon: "🔄", title: "Tontine Rotative", desc: "Gestion automatisée des tours et cotisations périodiques." },
        { icon: "💰", title: "Épargne-Crédit", desc: "Prêts entre membres avec votes et remboursements suivis." },
        { icon: "🔔", title: "Notifications", desc: "Alertes en temps réel pour chaque action dans vos groupes." },
        { icon: "🛡️", title: "Sécurité KYC", desc: "Vérification d'identité pour la création de groupes." },
      ].map((item, i) => (
        <div key={i} style={{
          padding: "16px", borderRadius: "var(--radius-md)",
          background: "var(--blanc)", border: "1px solid var(--slate-200)"
        }}>
          <div style={{ fontSize: "22px", marginBottom: "8px" }}>{item.icon}</div>
          <strong style={{ fontSize: "13px", color: "var(--slate-800)", display: "block", marginBottom: "4px" }}>{item.title}</strong>
          <p style={{ fontSize: "12px", color: "var(--slate-400)", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
        </div>
      ))}
    </div>

    {/* Informations légales */}
    <div style={{
      padding: "16px 20px", borderRadius: "var(--radius-md)",
      background: "var(--slate-50)", border: "1px solid var(--slate-200)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <Shield size={15} color="var(--slate-600)" />
        <strong style={{ fontSize: "13px", color: "var(--slate-800)" }}>Informations légales</strong>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { label: "Développeur", value: "Trois Clés Technologies" },
          { label: "Contact", value: "contact@troiscles.app" },
          { label: "Politique de confidentialité", value: "Voir le document", link: true },
          { label: "Conditions d'utilisation", value: "Voir le document", link: true },
        ].map((row, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingBottom: i < 3 ? "8px" : 0,
            borderBottom: i < 3 ? "1px solid var(--slate-200)" : "none"
          }}>
            <span style={{ fontSize: "12px", color: "var(--slate-400)" }}>{row.label}</span>
            {row.link ? (
              <a href="#" style={{
                fontSize: "12px", color: "var(--bleu)", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "4px"
              }}>
                {row.value} <ExternalLink size={11} />
              </a>
            ) : (
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate-800)" }}>{row.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Pied de page */}
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <p style={{ fontSize: "12px", color: "var(--slate-400)", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
        Fait avec <Heart size={12} color="var(--rouge)" fill="var(--rouge)" /> pour les communautés d'épargne
      </p>
      <p style={{ fontSize: "11px", color: "var(--slate-200)", marginTop: "4px" }}>
        © {new Date().getFullYear()} Trois Clés. Tous droits réservés.
      </p>
    </div>
  </div>
);

export default APropos;
