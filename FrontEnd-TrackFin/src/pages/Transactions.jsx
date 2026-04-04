import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import { useDialog } from "../context/DialogContext";
import { useState } from "react";

function Transactions() {
  const currency = import.meta.env.VITE_CURRENCY;

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [cat, setCat] = useState("");
  const [minPrice, setPMin] = useState("");
  const [maxPrice, setPMax] = useState("");
  const [fromDate, setDFrom] = useState("");
  const [toDate, setDTo] = useState("");

  const { openDialog } = useDialog();

  const handleNewTransactionDialog = async (e) => {
    openDialog({
      title: "Ajouter une transaction",
      fields: [
        { key: "label", type: "text", label: "Label", required: true },
        { key: "amount", type: "number", label: "Montant", required: true },
        { key: "description", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }]
        },
        
        {
          key: "contact_id", type: "select", label: "Client/Fournisseur", required: true,
          options: [{ value: 1, label: "Société A" }, { value: 2, label: "Société B" }]// à remplacer par les contacts réels de l'utilisateur
        },
        
        {
          key: "category_id", type: "select", label: "Catégorie", required: true,
          options: [{ value: 1, label: "Salaire" }, { value: 2, label: "Facture" }]// à remplacer par les catégories réelles de l'utilisateur
        },
      ],
      onSubmit: (values) => console.log("Nouvelle transaction:", values),
    });
  };

  const handleTransactionDetailsDialog = async (id) => {
    openDialog({
      title: "Détails de la transaction " + id,
      fields: [
        { key: "label", type: "text", label: "Label", required: true },
        { key: "amount", type: "number", label: "Montant", required: true },
        { key: "description", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }]
        },
        
        {
          key: "contact_id", type: "select", label: "Client/Fournisseur", required: true,
          options: [{ value: 1, label: "Société A" }, { value: 2, label: "Société B" }]// à remplacer par les contacts réels de l'utilisateur
        },
        
        {
          key: "category_id", type: "select", label: "Catégorie", required: true,
          options: [{ value: 1, label: "Salaire" }, { value: 2, label: "Facture" }]// à remplacer par les catégories réelles de l'utilisateur
        },
      ],
      onSubmit: (values) => console.log("Détails de la transaction:", values),
    });
  };

  return (
    <div className="pageBloc">
      <Banner title="150 Transactions" callToAction={<CallToAction1 title="Nouvelle transaction" iconSrc={addIcon} action={handleNewTransactionDialog} />} />
      <BlockFilter
        search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, libellé,..." }}
        selects={[
          { value: type, onChange: e => setType(e.target.value), placeholder: "Tout type", options: [] },
          { value: cat, onChange: e => setCat(e.target.value), placeholder: "Toute catégorie", options: [] },
        ]}
        amounts={{
          min: { value: minPrice, onChange: e => setPMin(e.target.value) },
          max: { value: maxPrice, onChange: e => setPMax(e.target.value) }
        }}
        dates={{
          from: { value: fromDate, onChange: e => setDFrom(e.target.value) },
          to: { value: toDate, onChange: e => setDTo(e.target.value) }
        }}
      />


      {/* Contenu de la page Transactions */}

      <div style={{ height: "70vh" }}> {/* 🔥 base */}

        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "white",
            padding: "20px",
            borderRadius: "20px",
          }}
        >

          {/* Zone qui prend le reste */}
          <div style={{ flex: 1, padding: "20px" }}>

            <table style={{ width: "100%", height: "100%", borderCollapse: "collapse" }}>

              {/* THEAD */}
              <thead>
                <tr
                  style={{
                    display: "table",
                    width: "100%",
                    tableLayout: "fixed",
                    height: "50px",
                    color: "#0000007c",
                    fontWeight: "500",
                    borderTop: "1px solid #b8b4b483",
                    borderBottom: "1px solid #b8b4b471",
                  }}
                >
                  <th style={{ textAlign: "left", width: "100px" }}>ID</th>
                  <th style={{ textAlign: "left", width: "150px" }}>Type</th>
                  <th style={{ textAlign: "left", width: "200px" }}>Libellé</th>
                  <th style={{ textAlign: "right", width: "150px" }}>Montant ({currency})</th>
                  <th style={{ textAlign: "right", width: "150px" }}>Catégorie</th>
                  <th style={{ textAlign: "right", width: "150px" }}>Date</th>
                </tr>
              </thead>

              {/* TBODY SCROLL */}
              <tbody
                style={{
                  display: "block",
                  height: "100%",
                  overflowY: "auto",
                }}
              >
                {[...Array(50)].map((_, i) => (
                  <tr
                    onClick={() => handleTransactionDetailsDialog(i)}
                    key={i}
                    style={{
                      cursor: "pointer",
                      display: "table",
                      width: "100%",
                      tableLayout: "fixed",
                      height: "50px",
                    }}
                  >
                    <td style={{ textAlign: "left", width: "100px" }}>#00{i}</td>
                    <td style={{ textAlign: "left", width: "150px" }}>Dépense</td>
                    <td style={{ textAlign: "left", width: "200px" }}>Maintient Ligdicash</td>
                    <td style={{ textAlign: "right", width: "150px" }}>160000</td>
                    <td style={{ textAlign: "right", width: "150px" }}>Facture</td>
                    <td style={{ textAlign: "right", width: "150px" }}>12/01/2023</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;