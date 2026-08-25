import { useState } from "react";
import { ShieldAlert, UserMinus, RotateCcw, AlertTriangle } from "lucide-react";
import { modererMembre } from "../services/groupeService";

export default function ModerationMembres({ membre, estResponsable, onMaj }) {
  const [ouvert, setOuvert] = useState(false);
  const [action, setAction] = useState("");
  const [motif, setMotif] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  if (!estResponsable) return null;
  if (membre.statutMembre === "Parti") return null;

  const handleAction = async (e) => {
    e.preventDefault();
    setErreur("");
    if (action !== "retablir" && !motif.trim()) {
      setErreur("Le motif est obligatoire.");
      return;
    }
    setLoading(true);
    try {
      await modererMembre(membre.id, action, motif);
      setOuvert(false);
      setMotif("");
      setAction("");
      onMaj?.();
    } catch (err) {
      setErreur(err.response?.data?.detail || "Action impossible.");
    } finally {
      setLoading(false);
    }
  };

  const estSuspendu = membre.statutMembre === "Suspendu";

  return (
    <>
      <button
        onClick={() => setOuvert(true)}
        style={{ background: "none", border: "1px solid var(--slate-200)", borderRadius: "var(--radius-sm)", padding: "5px 10px", fontSize: 12, color: "var(--slate-600)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
        title="Modérer ce membre"
      >
        <ShieldAlert size={12} /> Modérer
      </button>

      {ouvert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}
          onClick={() => setOuvert(false)}>
          <div style={{ background: "var(--blanc)", borderRadius: "var(--radius-lg)", padding: 28, maxWidth: 420, width: "100%", boxShadow: "var(--shadow-lg)" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, margin: 0 }}>Modérer — {membre.user}</h3>
              <button onClick={() => setOuvert(false)} style={{ background: "none", border: "none", color: "var(--slate-400)", cursor: "pointer", fontSize: 20 }}>×</button>
            </div>

            <form onSubmit={handleAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Choix action */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {!estSuspendu && (
                  <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", border: `2px solid ${action === "suspendre" ? "var(--ambre)" : "var(--slate-200)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", background: action === "suspendre" ? "var(--ambre-bg)" : "var(--blanc)" }}>
                    <input type="radio" name="action" value="suspendre" checked={action === "suspendre"} onChange={() => setAction("suspendre")} />
                    <AlertTriangle size={16} color="var(--ambre)" />
                    <div>
                      <strong style={{ fontSize: 13.5, color: "var(--ambre)", display: "block" }}>Suspendre</strong>
                      <span style={{ fontSize: 12, color: "var(--texte-clair)" }}>Le membre ne peut plus cotiser temporairement</span>
                    </div>
                  </label>
                )}

                {estSuspendu && (
                  <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", border: `2px solid ${action === "retablir" ? "var(--vert)" : "var(--slate-200)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", background: action === "retablir" ? "var(--vert-bg)" : "var(--blanc)" }}>
                    <input type="radio" name="action" value="retablir" checked={action === "retablir"} onChange={() => setAction("retablir")} />
                    <RotateCcw size={16} color="var(--vert-dark)" />
                    <div>
                      <strong style={{ fontSize: 13.5, color: "var(--vert-dark)", display: "block" }}>Rétablir</strong>
                      <span style={{ fontSize: 12, color: "var(--texte-clair)" }}>Réactiver l'accès du membre</span>
                    </div>
                  </label>
                )}

                <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", border: `2px solid ${action === "demander_exclure" ? "var(--rouge)" : "var(--slate-200)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", background: action === "demander_exclure" ? "var(--rouge-bg)" : "var(--blanc)" }}>
                  <input type="radio" name="action" value="demander_exclure" checked={action === "demander_exclure"} onChange={() => setAction("demander_exclure")} />
                  <UserMinus size={16} color="var(--rouge)" />
                  <div>
                    <strong style={{ fontSize: 13.5, color: "var(--rouge)", display: "block" }}>Demander l'exclusion</strong>
                    <span style={{ fontSize: 12, color: "var(--texte-clair)" }}>Envoie une demande à l'administration</span>
                  </div>
                </label>
              </div>

              {/* Motif */}
              {action && action !== "retablir" && (
                <div className="form-group">
                  <label>Motif <span style={{ color: "var(--rouge)" }}>*</span></label>
                  <textarea
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    rows={3}
                    placeholder="Expliquez la raison de cette décision..."
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>
              )}

              {erreur && <div className="form-message error">{erreur}</div>}

              {!action && <p style={{ fontSize: 13, color: "var(--slate-400)", textAlign: "center" }}>Choisissez une action ci-dessus</p>}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" className="btn-secondary" onClick={() => setOuvert(false)}>Annuler</button>
                <button type="submit" className="btn-primary" disabled={loading || !action}
                  style={{ background: action === "retablir" ? "var(--vert)" : action === "suspendre" ? "var(--ambre)" : action === "demander_exclure" ? "var(--rouge)" : "var(--vert)" }}>
                  {loading ? "Traitement..." : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
