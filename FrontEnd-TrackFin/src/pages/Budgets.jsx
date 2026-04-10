import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import BudgetBox from "../components/BudgetBox";
import { useDialog } from "../context/DialogContext";
import { useState, useEffect, useMemo } from "react";
import { getBudgets, createBudget, deleteBudget, updateBudget } from "../services/BudgetServices";
import { getCategories } from "../services/CategoryServices";

function Budgets() {

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [fromDate, setDFrom] = useState("");

  const { openDialog } = useDialog();

  // ── Chargement initial ──────────────────────────────────────────
  useEffect(() => {
    async function fetchBudgets() {
      try {
        setLoading(true);
        const data = await getBudgets();
        const data2 = await getCategories();
        setBudgets(data.budgets);
        setCategories(data2.categories);
      } catch (err) {
        setError(err.message ?? "Erreur lors du chargement des budgets");
      } finally {
        setLoading(false);
      }
    }

    fetchBudgets();
  }, []);

  // ── Rafraichir la liste ────────────────────────────────────────────────────
  const refreshBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgets();
      setBudgets(data.budgets);
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleNewBudgetDialog = async (e) => {
    openDialog({
      title: "Ajouter un budget",
      fields: [
        { key: "category_id", type: "select", label: "Catégorie", required: true, options: categories.map(category => ({ value: category.id, label: category.name })) },
        { key: "amount_limit", type: "number", label: "Montant limit", required: true },
        { key: "month", type: "month-select", label: "Mois", required: true },
        { key: "year", type: "number", label: "Année", placeholder: "2025", required: true, min: 2000, max: 2100, },
      ],
      onSubmit: async (values) => {
        try {
          await createBudget(values);
          await refreshBudgets();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handleBudgetDetailsDialog = async (budget) => {
    openDialog({
      title: "Détails du budget — " + categories.find(c => c.id === budget.category_id)?.name,
      initialValues: {
        category_id: budget.category_id,
        amount_limit: budget.amount_limit,
        month: budget.month,
        year: budget.year,
      },
      fields: [
        { key: "category_id", type: "select", label: "Catégorie", required: true, disabled: true, options: categories.map(category => ({ value: category.id, label: category.name })) },
        { key: "amount_limit", type: "number", label: "Montant limit", required: true },
        { key: "month", type: "month-select", label: "Mois", required: true, disabled: true },
        { key: "year", type: "number", label: "Année", placeholder: "2025", required: true, disabled: true, min: 2000, max: 2100, },
      ],
      onDelete: async (id) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce budget " + budget.id + " ?");
        if (confirmed) {
          try {
            await deleteBudget(budget.id);
            await refreshBudgets();
          } catch (error) {
            alert(error.message);
          }
        }
      },
      onSubmit: async (values) => {
        try {
          await updateBudget(budget.id, values);
          await refreshBudgets();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  // ── Filtrage ───────────────────────────────────────────────────
  const filteredBudgets = useMemo(() => {
    return budgets.filter(budget => {
      // Recherche textuelle — id, catégorie
      if (q) {
        const search = q.toLowerCase();
        const matchId = String(budget.id).includes(search);
        const matchCategory = budget.category?.name?.toLowerCase().includes(search) || String(budget.category_id).includes(search);
        if (!matchId && !matchCategory) return false;
      }

      // Filtre catégorie
      if (cat && String(budget.category_id) !== String(cat)) return false;

      // Filtre mois
      if (fromDate) {
        const [filterYear, filterMonth] = fromDate.split("-");
        if (String(budget.year) !== filterYear || String(budget.month).padStart(2, "0") !== filterMonth) return false;
      }

      return true;
    });
  }, [budgets, q, cat, fromDate]);

  // Bloc filtre partagé — rendu inline en desktop, popup en mobile via Banner
  const filterBlock = (
    <BlockFilter
        search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, libellé,..." }}
        selects={[
          { value: cat, onChange: e => setCat(e.target.value), placeholder: "Toute catégorie", options: categories.map(category => ({ value: category.id, label: category.name })) },
        ]}
        dates={{
          from: { value: fromDate, mode: "month", onChange: e => setDFrom(e.target.value) },
        }}
      />
  )

  return (
    <div className="pageBloc">
      <Banner title={`${filteredBudgets.length} Budgets`} 
      callToAction={<CallToAction1 title="Nouveau budget" iconSrc={addIcon} action={handleNewBudgetDialog} />}
      filterContent={filterBlock} />
      

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

        {/* États de chargement et d'erreur */}
        {loading && <p style={{ textAlign: "center", color: "#9ca3af" }}>Chargement...</p>}
        {error && <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>}

        {/* Liste des budgets */}
        {!loading && !error && filteredBudgets.map((budget) => (
          <BudgetBox
            onClick={() => handleBudgetDetailsDialog(budget)}
            key={budget.id}
            id={budget.id}
            category={categories.find(c => c.id === budget.category_id)?.name ?? "-"}
            date={`${String(budget.month).padStart(2, "0")}/${budget.year}`}
            amountLimit={budget.amount_limit}
            spentAmount={budget.spent_amount}
          />
        ))}

        {/* Liste vide */}
        {!loading && !error && filteredBudgets.length === 0 && (
          <p style={{ textAlign: "center", color: "#9ca3af", width: "100%" }}>Aucun budget trouvé</p>
        )}
      </div>
    </div>
  );
}

export default Budgets;