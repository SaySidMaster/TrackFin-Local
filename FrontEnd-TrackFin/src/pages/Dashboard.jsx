import Banner from "../components/Banner";
import { useState, useEffect } from "react";
import { getDashboard } from "../services/DashboardServices";



const fmt = (n) => Number(n).toLocaleString("fr-FR");

// ── Histogramme VERTICAL (desktop ≥ 1024px) ──────────────────────────────
const ChartVertical = ({ evolution, max, hovered, setHovered, currency, fmt }) => {
  const gridLines = [0, 25, 50, 75, 100];
  return (
    <div style={{ position: "relative", height: "85%" }}>
      {/* Lignes de grille + labels axe Y */}
      {gridLines.map((pct) => (
        <div key={pct} style={{
          position: "absolute", left: 0, right: 0,
          bottom: `${pct}%`,
          display: "flex", alignItems: "center",
          pointerEvents: "none", zIndex: 0,
        }}>
          <span style={{ fontSize: 10, color: "#cbd5e1", width: 36, textAlign: "right", paddingRight: 8, flexShrink: 0 }}>
            {pct === 0 ? "0" : `${Math.round(max * pct / 100 / 1000)}k`}
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: pct === 0 ? "#e2e8f0" : "#f1f5f9" }} />
        </div>
      ))}

      {/* Barres verticales */}
      <div style={{
        position: "absolute",
        left: 44, right: 0, top: 0, bottom: 0,
        display: "flex", alignItems: "flex-end",
        gap: "6px", paddingBottom: 1,
      }}>
        {evolution.map((d, i) => {
          const hauteurPct = (Math.abs(d.valeur) / max) * 100;
          const isPos = d.valeur >= 0;
          const isHov = hovered === i;

          return (
            <div
              key={d.mois}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", cursor: "default" }}
            >
              {/* Tooltip */}
              {isHov && (
                <div style={{
                  position: "absolute",
                  bottom: `calc(${hauteurPct}% + 12px)`,
                  backgroundColor: "#0f172a", color: "white",
                  padding: "5px 10px", borderRadius: 8,
                  fontSize: 11, fontWeight: 600,
                  whiteSpace: "nowrap", zIndex: 10,
                  pointerEvents: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}>
                  {isPos ? "+" : "-"}{fmt(Math.abs(d.valeur))} {currency}
                  <div style={{
                    position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
                    width: 0, height: 0,
                    borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                    borderTop: "5px solid #0f172a",
                  }} />
                </div>
              )}

              {/* Barre */}
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                <div className="db-bar" style={{
                  width: "100%",
                  height: `${hauteurPct}%`,
                  borderRadius: "6px 6px 2px 2px",
                  background: isPos
                    ? isHov ? "linear-gradient(180deg,#22c55e,#16a34a)" : "linear-gradient(180deg,#4ade80,#16a34a)"
                    : isHov ? "linear-gradient(180deg,#f87171,#dc2626)" : "linear-gradient(180deg,#fca5a5,#ef4444)",
                  transition: "opacity 0.15s",
                  animationDelay: `${i * 0.04}s`,
                  opacity: isHov ? 0.85 : 1,
                }} />
              </div>

              {/* Label mois */}
              <span style={{
                fontSize: 11,
                fontWeight: isHov ? 700 : 500,
                color: isHov ? "#0f172a" : "#94a3b8",
                transition: "color 0.15s",
                flexShrink: 0,
              }}>
                {d.mois}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Dashboard() {
  const currency = import.meta.env.VITE_CURRENCY;
  const [hovered, setHovered] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Détection responsive
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    getDashboard()
      .then(res => setDashData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pageBloc"><p>Chargement...</p></div>;
  if (!dashData) return <div className="pageBloc"><p>Erreur de chargement</p></div>;

  const { evolution, transaction_count, periode,
    total_income, total_expense,
    total_debts, total_receivables,
    total_budget, rest_budget } = dashData;

  const STATS = [
    { label: "Revenus", valeur: total_income, couleur: "#16a34a" },
    { label: "Dépenses", valeur: total_expense, couleur: "#ef4444" },
    { label: "Dettes", valeur: total_debts, couleur: "#f59e0b" },
    { label: "Créances", valeur: total_receivables, couleur: "#3b82f6" },
    { label: "Budget", valeur: total_budget, couleur: "#8b5cf6" },
    { label: "Reste budget", valeur: rest_budget, couleur: "#0ea5e9" },
  ];

  const max = Math.max(...evolution.map(d => Math.abs(d.valeur)), 1);
  const total = evolution.reduce((s, d) => s + d.valeur, 0);
  const positif = total >= 0;



  // ── Histogramme HORIZONTAL (mobile ≤ 1024px) ─────────────────────────────
  const ChartHorizontal = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      overflowY: "auto",
      flex: 1,
    }}>
      {[...evolution].reverse().map((d, i) => {
        const largeurPct = (Math.abs(d.valeur) / max) * 100;
        const isPos = d.valeur >= 0;
        const isHov = hovered === i;

        return (
          <div
            key={d.mois}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onTouchStart={() => setHovered(i)}
            onTouchEnd={() => setHovered(null)}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "default" }}
          >
            {/* Label mois — axe Y à gauche */}
            <span style={{
              fontSize: 11,
              fontWeight: isHov ? 700 : 500,
              color: isHov ? "#0f172a" : "#64748b",
              width: 28,
              flexShrink: 0,
              textAlign: "right",
              transition: "color 0.15s",
            }}>
              {d.mois}
            </span>

            {/* Zone barre */}
            <div style={{ flex: 1, position: "relative", height: 22, display: "flex", alignItems: "center" }}>
              {/* Fond de piste */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundColor: "#f1f5f9", borderRadius: 6,
              }} />

              {/* Barre colorée */}
              <div className="db-bar-h" style={{
                position: "relative",
                width: `${largeurPct}%`,
                height: "100%",
                borderRadius: 6,
                background: isPos
                  ? isHov ? "linear-gradient(90deg,#4ade80,#16a34a)" : "linear-gradient(90deg,#86efac,#22c55e)"
                  : isHov ? "linear-gradient(90deg,#f87171,#dc2626)" : "linear-gradient(90deg,#fca5a5,#ef4444)",
                transition: "width 0.4s cubic-bezier(.22,.68,0,1.2), opacity 0.15s",
                opacity: isHov ? 0.85 : 1,
                minWidth: d.valeur !== 0 ? 4 : 0,
              }} />
            </div>

            {/* Valeur à droite */}
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: isPos ? "#16a34a" : "#ef4444",
              whiteSpace: "nowrap",
              minWidth: 60,
              textAlign: "right",
            }}>
              {isPos ? "+" : "-"}{fmt(Math.abs(d.valeur))}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="pageBloc">
      <style>{`
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        .db-bar {
          transform-origin: bottom;
          animation: barGrow 0.5s cubic-bezier(.22,.68,0,1.2) both;
        }
        .db-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important;
        }
      `}</style>

      <Banner title="Dashboard" />

      {/* ── Carte stats ──────────────────────────────────────────────── */}
      <div style={{ background: "white", borderRadius: 20, padding: "20px 24px", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>

          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Transactions</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              <strong style={{ color: "#0f172a" }}>{transaction_count} transactions</strong> · {periode}
            </p>
          </div>

          <div className="ScrollableDiv2" style={{
            display: "flex", flexDirection: "row", flexWrap: "nowrap",
            alignItems: "center", gap: 12,
            overflowX: "auto", overflowY: "hidden", paddingBottom: 10,
          }}>
            {STATS.map((s) => (
              <div key={s.label} className="db-stat-card" style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 2, padding: "10px 16px", borderRadius: 12,
                backgroundColor: `${s.couleur}10`,
                border: `1.5px solid ${s.couleur}25`,
                minWidth: 90,
                transition: "transform 0.15s, box-shadow 0.15s",
                cursor: "default",
              }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: s.couleur }}>
                  {fmt(s.valeur)}
                </span>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500, textAlign: "center" }}>
                  {s.label}
                </span>
                <div style={{ width: 24, height: 3, borderRadius: 3, backgroundColor: s.couleur, marginTop: 2, opacity: 0.4 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Carte graphique ───────────────────────────────────────────── */}
      <div style={{
        background: "white",
        borderRadius: 20,
        height: isMobile ? "auto" : "70vh",
        minHeight: isMobile ? 420 : undefined,
        padding: isMobile ? "20px 16px" : "24px 28px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* En-tête */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Variation du solde théorique
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Sur les 12 derniers mois
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Solde annuel</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: positif ? "#16a34a" : "#ef4444" }}>
                {positif ? "+" : ""}{fmt(total)} {currency}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "#16a34a" }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>Positif</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "#ef4444" }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>Négatif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique — vertical ou horizontal selon l'écran */}
        {isMobile ? <ChartHorizontal /> : <ChartVertical
    evolution={evolution}
    max={max}
    hovered={hovered}
    setHovered={setHovered}
    currency={currency}
    fmt={fmt}
  />}
      </div>
    </div>
  );
}

export default Dashboard;