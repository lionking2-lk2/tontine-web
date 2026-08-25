import { useState, useEffect } from "react";
import { Key, Trash2, Plus, AlertCircle } from "lucide-react";
import api from "../api/axios";

export default function GestionValidateurs({ groupeId, estResponsable }) {
  const [validateurs, setValidateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState({ identifiant: "", ordre: "2" });
  const [saving, setSaving] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succès, setSuccès] = useState("");

  const charger = () => {
    api.get(`/groups/validateurs/?groupe=${groupeId}`)
      .then((res) => setValidateurs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, [groupeId]);

  const handleAjouter = async (e) => {
    e.preventDefault();
    setErreur(""); setSuccès("");
    setSaving(true);
    try {
      // Chercher l'utilisateur par username/email/téléphone
      const search = await api.get(`/platform/users/?search=${encodeURIComponent(form.identifiant)}`);
      const users = search.data?.results || search.data;
      if (!users || users.length === 0) {
        setErreur("Aucun utilisateur trouvé pour cet identifiant.");
        return;
      }
      const userId = users[0].id;
      await api.post("/groups/validateurs/", {
        groupe: Number(groupeId),
        user: userId,
        ordre: Number(form.ordre),
        statut: "Actif",
      });
      setSuccès("Validateur ajouté.");
      setForm({ identifiant: "", ordre: "2" });
      charger();
    } catch (err) {
      const data = err.response?.data;
      setErreur(data?.detail || Object.values(data || {}).flat()[0] || "Impossible d'ajouter ce validateur.");
    } finally {
      setSaving(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm("Retirer ce validateur ?")) return;
    try {
      await api.delete(`/groups/validateurs/${id}/`);
      charger();
    } catch {
      alert("Impossible de retirer ce validateur.");
    }
  };

  if (!estResponsable) return null;

  const ordresOccupes = validateurs.map((v) => v.ordre);
  const ordresDisponibles = [1, 2, 3].filter((o) => !ordresOccupes.includes(o));

  return (
    <div style={{ marginTop: 20 }}>
      <button
        className="dt-action-vert"
        onClick={() => setOuvert(!ouvert)}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <Key size={15} /> Gérer les validateurs (3 Clés)
      </button>

      {ouvert && (
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "var(--radius-md)", padding: 18 }}>
          {/* Liste actuelle */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 10 }}>
              Validateurs actuels
            </p>
            {loading ? (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Chargement...</p>
            ) : validateurs.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: "var(--radius-sm)" }}>
                <AlertCircle size={15} color="#fbbf24" />
                <span style={{ fontSize: 13, color: "#fbbf24" }}>Aucun validateur — ajoutez les 3 clés pour activer les votes de prêt</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {validateurs.map((v) => (
                  <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)" }}>
                    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--vert)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {v.ordre}
                    </span>
                    <span style={{ flex: 1, fontSize: 13.5, color: "#fff", fontWeight: 600 }}>{v.user}</span>
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: "var(--radius-full)", background: v.statut === "Actif" ? "rgba(22,163,74,0.2)" : "rgba(148,163,184,0.2)", color: v.statut === "Actif" ? "#86efac" : "#94a3b8" }}>
                      {v.statut}
                    </span>
                    <button onClick={() => handleSupprimer(v.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ajouter validateur */}
          {ordresDisponibles.length > 0 && (
            <form onSubmit={handleAjouter} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 4 }}>
                Ajouter un validateur
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur, email ou téléphone"
                  value={form.identifiant}
                  onChange={(e) => setForm({ ...form, identifiant: e.target.value })}
                  required
                  style={{ flex: 1, padding: "9px 13px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 13 }}
                />
                <select
                  value={form.ordre}
                  onChange={(e) => setForm({ ...form, ordre: e.target.value })}
                  style={{ padding: "9px 13px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(30,41,59,0.8)", color: "#fff", fontSize: 13 }}
                >
                  {ordresDisponibles.map((o) => (
                    <option key={o} value={o}>Clé {o}</option>
                  ))}
                </select>
                <button type="submit" disabled={saving} className="dt-action-vert" style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                  <Plus size={14} /> {saving ? "..." : "Ajouter"}
                </button>
              </div>
              {erreur && <p style={{ fontSize: 12.5, color: "#fca5a5" }}>{erreur}</p>}
              {succès && <p style={{ fontSize: 12.5, color: "#86efac" }}>{succès}</p>}
            </form>
          )}

          {ordresDisponibles.length === 0 && (
            <p style={{ fontSize: 13, color: "#86efac", display: "flex", alignItems: "center", gap: 6 }}>
              ✅ Les 3 clés sont en place — les votes de prêt sont activés
            </p>
          )}
        </div>
      )}
    </div>
  );
}
