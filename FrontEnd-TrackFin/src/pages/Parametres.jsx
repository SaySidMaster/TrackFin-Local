import Banner from "../components/Banner";
import CategoryBox from "../components/CategoryBox";
import ProfilBox from "../components/ProfilBox";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import { useState } from "react";

function Parametres() {

  const [q, setQ] = useState("");

  const inputStyle = {
  height: "40px",
  padding: "0 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13px",
  fontFamily: "inherit",
  color: "#0f172a",
  backgroundColor: "white",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "text",
};

  return (
    <div className="pageBloc">
      <Banner title="Paramètres" />

      {/* Contenu de la page Paramètres */}
      {/* Categories and général */}
      <div className="ScrollableDiv" style={{
        height: "90vh",
        display: "flex",
        gap: "12px",
      }}>


        {/* Profils bloc */}
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "20px",
          border: "1px solid #0000001a",
          borderRadius: "20px",
        }}>
          <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
            <h2>Profils</h2>
            <CallToAction1 title="Ajouter" iconSrc={addIcon} action={() => { }} />
          </div>
          <form action="">
            <div style={{ position: "relative", flex: 2, minWidth: "200px" }}>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher..."
                style={{ ...inputStyle, width: "100%", padding: "0px 10px" }}
              />
            </div>
          </form>
          <div className="ScrollableDiv" style={{
            width: "100%",
            height: "100%",
            gap: "12px",
            overflowY: "auto",
          }}>
            {[...Array(15)].map((_, i) => (
              <ProfilBox
                key={i}
                id={i}
                name={i % 2 === 0 ? "Jean Dupont" : "Marie Martin"}
                post={i % 2 === 0 ? "Administrateur" : "Comptable"}
                username={i % 2 === 0 ? "jean.dupont" : "marie.martin"}
                status={i % 3 === 0 ? "active" : "inactive"}
              />
            ))}
          </div>

        </div>

        {/* Categories bloc */}
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "20px",
          border: "1px solid #0000001a",
          borderRadius: "20px",
        }}>
          <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
            <h2>Categories</h2>
            <CallToAction1 title="Ajouter" iconSrc={addIcon} action={() => { }} />
          </div>
          <form action="">
            <div style={{ position: "relative", flex: 2, minWidth: "200px" }}>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher..."
                style={{ ...inputStyle, width: "100%", padding: "0px 10px" }}
              />
            </div>
          </form>
          <div className="ScrollableDiv" style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            gap: "12px",
          }}>
            <CategoryBox
                libelle="Salaire"
                type="Depense"
                nbTransactions={15}
              />
            <CategoryBox
                libelle="Facture"
                type="Depense"
                nbTransactions={15}
              />
            <CategoryBox
                libelle="Vente"
                type="Revenus"
                nbTransactions={15}
              />
            <CategoryBox
                libelle="Investissement"
                type="Depense"
                nbTransactions={15}
              />
            <CategoryBox
                libelle="Recherche et developpement"
                type="Depense"
                nbTransactions={15}
              />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Parametres;