import Banner from "../components/Banner";
import CategoryBox from "../components/CategoryBox";
import ProfilBox from "../components/ProfilBox";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import { useDialog } from "../context/DialogContext";
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


  const { openDialog } = useDialog();

  const handleNewProfilDialog = async (e) => {
    openDialog({
      title: "Ajouter un profil",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "email", type: "email", label: "Email", required: true },
        {
          key: "role", type: "select", label: "Rôle", required: true,
          options: [{ value: "admin", label: "Administrateur" }, { value: "accountant", label: "Comptable" }, { value: "user", label: "Utilisateur" }]
        },

        { key: "password", type: "password", label: "Mot de passe", required: true },

        { key: "confirmedPassword", type: "password", label: "Confirmer le mot de passe", required: true },
      ],
      onSubmit: (values) => console.log("Nouveau profil:", values),
    });
  };

  const handleProfilDetailsDialog = async (id) => {
    openDialog({
      title: "Détails du profil " + id,
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "email", type: "email", label: "Email", required: true },
        {
          key: "role", type: "select", label: "Rôle", required: true,
          options: [{ value: "admin", label: "Administrateur" }, { value: "accountant", label: "Comptable" }, { value: "user", label: "Utilisateur" }]
        },

      ],
      onSubmit: (values) => console.log("Détails du profil:", values),
    });
  };


  const handleNewCategoryDialog = async (e) => {
    openDialog({
      title: "Ajouter une catégorie",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }]
        },
      ],
      onSubmit: (values) => console.log("Nouvelle catégorie:", values),
    });
  };

  const handleCategoryDetailsDialog = async (id) => {
    openDialog({
      title: "Détails de la catégorie " + id,
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }]
        },
      ],
      onSubmit: (values) => console.log("Détails de la catégorie:", values),
    });
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
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Profils</h2>
            <CallToAction1 title="Ajouter" iconSrc={addIcon} action={handleNewProfilDialog} />
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
                onClick={() => handleProfilDetailsDialog(i)}
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
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Categories</h2>
            <CallToAction1 title="Ajouter" iconSrc={addIcon} action={handleNewCategoryDialog} />
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
              onClick={() => handleCategoryDetailsDialog(1)}
            />
            <CategoryBox
              libelle="Facture"
              type="Depense"
              nbTransactions={15}
              onClick={() => handleCategoryDetailsDialog(2)}
            />
            <CategoryBox
              libelle="Vente"
              type="Revenus"
              nbTransactions={15}
              onClick={() => handleCategoryDetailsDialog(3)}
            />
            <CategoryBox
              libelle="Investissement"
              type="Depense"
              nbTransactions={15}
              onClick={() => handleCategoryDetailsDialog(4)}
            />
            <CategoryBox
              libelle="Recherche et developpement"
              type="Depense"
              nbTransactions={15}
              onClick={() => handleCategoryDetailsDialog(5)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Parametres;