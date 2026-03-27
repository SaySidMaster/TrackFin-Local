import Banner from "../components/Banner";

function Dashboard() {
  const data = [
  { mois: "Jan", valeur: 320000 },
  { mois: "Fév", valeur: 150000 },
  { mois: "Mar", valeur: 480000 },
  { mois: "Avr", valeur: -80000 },
  { mois: "Mai", valeur: 290000 },
  { mois: "Juin", valeur: 510000 },
  { mois: "Juil", valeur: 120000 },
  { mois: "Août", valeur: -50000 },
  { mois: "Sep", valeur: 430000 },
  { mois: "Oct", valeur: 370000 },
  { mois: "Nov", valeur: 260000 },
  { mois: "Déc", valeur: 590000 },
];

  const max = Math.max(...data.map(d => Math.abs(d.valeur)));

  const currency = import.meta.env.VITE_CURRENCY;

  return (
    <div className="pageBloc">
      <Banner title="Dashboard" />

      <div style={{ margin: "30px 30px -60px 30px" }}>
        <h3>Variation du solde théorique sur 1 an.</h3>
      </div>
      <div style={{ 
        display: "flex", 
        alignItems: "flex-end", 
        gap: "8px", 
        height: "65vh", 
        border: "1px solid #0000001a",
        borderRadius: "20px",
        padding: "30px" }}>
        {data.map((d) => {
          const hauteur = `${(Math.abs(d.valeur) / max) * 100}%`;
          const positif = d.valeur >= 0;

          return (
            <div key={d.mois} style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              padding: "0 4px",
              gap: "6px", 
              height: "100%", }}>
              {/* Barre */}
              <div title={`${d.valeur.toLocaleString()} ${currency}`} style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%",
                  height: hauteur,
                  backgroundColor: positif ? "#16a34a" : "#ef4444",
                  borderRadius: "10px",
                  transition: "height 0.3s ease",
                }} />
              </div>
              {/* Mois */}
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>{d.mois}</span>
            </div>
          );
        })}
      </div>

      {/* Contenu de la page Transactions */}

      <div style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        padding: "20px",
        borderRadius: "20px",
      }} >
        <div style={{ textAlign: "left", }}>
          <h2 style={{ textAlign: "left", marginBottom: "10px" }}>Transactions</h2>
          <p><span style={{ fontWeight: "700" }}>150 transactions</span>, mois de septembre</p>
        </div>
        <div style={{ display: "flex", gap: "30px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <p style={{ textAlign: "center" }}><span style={{ fontWeight: "700", fontSize: "18px" }}>100.000</span><br />Revenus</p>
          <p style={{ textAlign: "center" }}><span style={{ fontWeight: "700", fontSize: "18px" }}>10.000</span><br />Dépenses</p>
          <p style={{ textAlign: "center" }}><span style={{ fontWeight: "700", fontSize: "18px" }}>25.000</span><br />Dettes</p>
          <p style={{ textAlign: "center" }}><span style={{ fontWeight: "700", fontSize: "18px" }}>75.000</span><br />Créances</p>
          <p style={{ textAlign: "center" }}><span style={{ fontWeight: "700", fontSize: "18px" }}>50.000</span><br />Budget</p>
          <p style={{ textAlign: "center" }}><span style={{ fontWeight: "700", fontSize: "18px" }}>40.000</span><br />Reste budget</p>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;