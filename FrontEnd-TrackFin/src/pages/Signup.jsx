import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import trackfinLogo from "../assets/trackfin.png";
import dashboardIcon from "../assets/icons/dashboard_2.svg";
import moneyIcon from "../assets/icons/dettes_2.svg";
import statisticIcon from "../assets/icons/statistics_2.svg";
import { signup } from "../services/AuthServices";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmedPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key, val) => {
    setError("");
    setForm(f => ({ ...f, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmedPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (form.password !== form.confirmedPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const data = await signup({
        name: form.fullName,
        role: "admin", //Il s'agit d'une première inscription, on lui attribue le rôle admin par défaut.
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmedPassword,
      });
      if (data.success) {
        navigate("/login");
      } else {
        setError("Échec de la création du compte. Veuillez réessayer.");
      }

    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      overflow: "hidden",
      fontFamily: "'Poppins', 'Montserrat', sans-serif",
    }}>
      <style>{`
        @keyframes lf-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .lf-input:focus { border-color: #081226 !important; box-shadow: 0 0 0 3px rgba(8,18,38,0.08) !important; }
        .lf-btn:hover:not(:disabled) { background-color: #1e293b !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(8,18,38,0.3) !important; }
        .lf-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .lf-toggle:hover { color: #081226 !important; }
      `}</style>

      {/* ── Panneau gauche : branding ──────────────────────────────── */}
      <div style={{
        width: "45%",
        backgroundColor: "#081226",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Cercles décoratifs */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", top: -100, right: -100 }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", bottom: -80, left: -80 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.06)", top: "40%", left: "50%", transform: "translate(-50%,-50%)" }} />

        {/* Contenu */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "lf-fade 0.5s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "40px" }}>
            <img src={trackfinLogo} alt="TrackFin" style={{ width: 52, height: 52, objectFit: "contain" }} />
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: "-0.5px", fontFamily: "'Montserrat Alternates', sans-serif" }}>
              TrackFin
            </h1>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 12 }}>
            Gestion Financière<br />Simplifiée & Intelligente
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 280, lineHeight: 1.7, margin: "0 auto" }}>
            Suivez vos finances en temps réel, gérez vos dépenses, budgets et dettes depuis une seule interface.
          </p>

          {/* Badges fonctionnalités */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 40, alignItems: "flex-start", maxWidth: 260, margin: "40px auto 0" }}>
            {[
              { icon: dashboardIcon, text: "Tableau de bord en temps réel" },
              { icon: moneyIcon, text: "Gestion des dettes & budgets" },
              { icon: statisticIcon, text: "Rapports financiers automatiques" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  <img
                    src={item.icon}
                    alt='icon'
                  />
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panneau droit : formulaire ─────────────────────────────── */}
      <div style={{
        flex: 1,
        backgroundColor: "#F0F4F5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: "44px 40px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          animation: "lf-fade 0.4s ease 0.1s both",
        }}>

          {/* Titre */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#081226", marginBottom: 6, letterSpacing: "-0.4px" }}>
              Bienvenue chez TrackFin !
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              Inscrivez-vous pour commencer à gérer vos finances efficacement.
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Full name */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Nom complet <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="text"
                  className="lf-input"
                  placeholder="Jean Dupont"
                  value={form.fullName}
                  onChange={e => handleChange("fullName", e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    height: 46,
                    paddingLeft: 42,
                    paddingRight: 14,
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Adresse e-mail <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  className="lf-input"
                  placeholder="vous@exemple.com"
                  value={form.email}
                  onChange={e => handleChange("email", e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    height: 46,
                    paddingLeft: 42,
                    paddingRight: 14,
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Mot de passe <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  className="lf-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => handleChange("password", e.target.value)}
                  style={{
                    width: "100%",
                    height: 46,
                    paddingLeft: 42,
                    paddingRight: 46,
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                />
                {/* Toggle visibilité */}
                <button
                  type="button"
                  className="lf-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 4, display: "flex", transition: "color 0.15s" }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirme mot de passe */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Confirmer le mot de passe <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type={showConfirmedPassword ? "text" : "password"}
                  className="lf-input"
                  placeholder="••••••••"
                  value={form.confirmedPassword}
                  onChange={e => handleChange("confirmedPassword", e.target.value)}
                  style={{
                    width: "100%",
                    height: 46,
                    paddingLeft: 42,
                    paddingRight: 46,
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                />
                {/* Toggle visibilité */}
                <button
                  type="button"
                  className="lf-toggle"
                  onClick={() => setShowConfirmedPassword(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 4, display: "flex", transition: "color 0.15s" }}
                >
                  {showConfirmedPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              className="lf-btn"
              disabled={loading}
              style={{
                width: "100%",
                height: 48,
                backgroundColor: "#081226",
                color: "white",
                border: "none",
                borderRadius: 30,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                marginTop: 4,
                transition: "background-color 0.15s, transform 0.15s, box-shadow 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "lf-spin 0.7s linear infinite" }} />
                  Inscription...
                </>
              ) : (
                <>
                  S'inscrire
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </>
              )}
            </button>

          </form>

          {/* Footer carte */}
          <Link to="/login" style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 28, marginBottom: 0 }}>
            Vous avez un compte ? <span style={{ color: "#081226", fontWeight: 600 }}>Connectez-vous</span>
          </Link>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes lf-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Signup;