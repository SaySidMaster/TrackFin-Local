import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import BudgetBox from "../components/BudgetBox";
import { useDialog } from "../context/DialogContext";
import { useState } from "react";

function Budgets() {

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [fromDate, setDFrom] = useState("");


  const { openDialog } = useDialog();

  const handleNewBudgetDialog = async (e) => {
    openDialog({
      title: "Ajouter un budget",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "amount_limit", type: "number", label: "Montant limit", required: true },
        { key: "month", type: "month-select", label: "Mois", required: true },
        { key: "year", type: "number", label: "Année", placeholder: "2025", required: true, min: 2000, max: 2100, },
      ],
      onSubmit: (values) => console.log("Nouveau budget:", values),
    });
  };

  const handleBudgetDetailsDialog = async (id) => {
    openDialog({
      title: "Détails du budget " + id,
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "amount_limit", type: "number", label: "Montant limit", required: true },
        { key: "month", type: "month-select", label: "Mois", required: true },
        { key: "year", type: "number", label: "Année", placeholder: "2025", required: true, min: 2000, max: 2100, },
      ],
      onSubmit: (values) => console.log("Détails du budget:", values),
    });
  };

  return (
    <div className="pageBloc">
      <Banner title="Budgets" callToAction={<CallToAction1 title="Nouveau budget" iconSrc={addIcon} action={handleNewBudgetDialog} />} />
      <BlockFilter
        search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, libellé,..." }}
        selects={[
          { value: cat, onChange: e => setCat(e.target.value), placeholder: "Toute catégorie", options: [] },
        ]}
        dates={{
          from: { value: fromDate, mode: "month", onChange: e => setDFrom(e.target.value) },
        }}
      />

      {/* Contenu de la page Budgets */}
      <div className="ScrollableDiv" style={{
        height: "75vh",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        gap: "12px",
        padding: "20px",
        border: "1px solid #0000001a",
        borderRadius: "20px",
      }}>


        {[...Array(15)].map((_, i) => (
          <BudgetBox
            onClick={() => handleBudgetDetailsDialog(i)}
            key={i}
            id={i}
            category={i % 2 === 0 ? "Marketing" : "R&D"}
            date={i % 2 === 0 ? "Janvier 2024" : "Février 2024"}
            amountLimit={i % 3 === 0 ? 140000 : i % 3 === 1 ? 120000 : 160000}
            actualAmount={i % 3 === 0 ? 120000 : i % 3 === 1 ? 140000 : 160000}
          />
        ))}
      </div>
    </div>
  );
}

export default Budgets;