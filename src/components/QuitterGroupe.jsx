import { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { quitterGroupe } from "../services/groupeService";

export default function QuitterGroupe({ groupeId, nomGroupe, estResponsable }) {
  const navigate = useNavigate();
  const [ouvert, setOuvert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  if (estResponsable) return null; // Le responsable ne peut pas quitter, il doit supprimer

  const handleQuitter = async () => {
    setErreur("");
    setLoading(true);
    try {
      await quitterGroupe(groupeId);
      navigate("/tontines");
    } catch (err) {
      setErreur(err.response?.data?.detail || "Impossible de quitter ce groupe pour le moment.");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOuvert(true)}
        style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "1px solid var(--rouge-border)", borderRadius: "var(--radius-sm)", padding: "8px 14px", fontSize: 13, color: "var(--rouge)", cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }}
      >
        <LogOut size={14} /> Quitter la tontine
      </button>

      {ouvert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}
          onClick={() => setOuvert(false)}>
          <div style={{ background: "var(--blanc)", borderRadius: "var(--radius-lg)", padding: 32, maxWidth: 400, width: "100%", boxShadow: "var(--shadow-lg)" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, background: "var(--rouge-bg)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <LogOut size={22} color="var(--rouge)" />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Quitter « {nomGroupe} » ?</h3>
              <p style={{ fontSize: 13.5, color: "var(--texte-clair)", lineHeight: 1.6 }}>
                Vous perdrez votre place dans cette tontine. Cette action est irréversible.
                Vos cotisations déjà versées restent enregistrées.
              </p>
            </div>

            {erreur && <div className="form-message error" style={{ marginBottom: 16 }}>{erreur}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setOuvert(false)}>Annuler</button>
              <button
                style={{ flex: 1, background: "var(--rouge)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
                onClick={handleQuitter}
                disabled={loading}
              >
                {loading ? "Traitement..." : "Oui, quitter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
