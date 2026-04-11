import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import BudgetBox from "../components/BudgetBox";
import Pagination from "../components/Pagination";
import { useDialog } from "../context/DialogContext";
import { useState, useEffect, useMemo } from "react";
import { usePagination } from "../hooks/usePagination";
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

  const handleNewBudgetDialog = async () => {
    openDialog({
      title: "Ajouter un budget",
      fields: [
        { key: "category_id",  type: "select",       label: "Catégorie",     required: true,
          options: categories.map(c => ({ value: c.id, label: c.name })) },
        { key: "amount_limit", type: "number",       label: "Montant limite", required: true },
        { key: "month",        type: "month-select", label: "Mois",           required: true },
        { key: "year",         type: "number",       label: "Année",          required: true, min: 2000, max: 2100, placeholder: "2025" },
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
        category_id:  budget.category_id,
        amount_limit: budget.amount_limit,
        month:        budget.month,
        year:         budget.year,
      },
      fields: [
        { key: "category_id",  type: "select",       label: "Catégorie",     required: true, disabled: true,
          options: categories.map(c => ({ value: c.id, label: c.name })) },
        { key: "amount_limit", type: "number",       label: "Montant limite", required: true },
        { key: "month",        type: "month-select", label: "Mois",           required: true, disabled: true },
        { key: "year",         type: "number",       label: "Année",          required: true, disabled: true, min: 2000, max: 2100 },
      ],
      onDelete: async () => {
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

  const filteredBudgets = useMemo(() => {
    return budgets.filter(budget => {
      if (q) {
        const search = q.toLowerCase();
        const matchId       = String(budget.id).includes(search);
        const matchCategory = budget.category?.name?.toLowerCase().includes(search)
          || String(budget.category_id).includes(search);
        if (!matchId && !matchCategory) return false;
      }
      if (cat && String(budget.category_id) !== String(cat)) return false;
      if (fromDate) {
        const [filterYear, filterMonth] = fromDate.split("-");
        if (String(budget.year) !== filterYear || String(budget.month).padStart(2, "0") !== filterMonth) return false;
      }
      return true;
    });
  }, [budgets, q, cat, fromDate]);

  // ── Pagination ──────────────────────────────────────────────────
  const { page, setPage, pageItems, totalPages, totalItems, from, to } =
    usePagination(filteredBudgets, 20);

  const filterBlock = (
    <BlockFilter
      search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, catégorie..." }}
      selects={[
        { value: cat, onChange: e => setCat(e.target.value), placeholder: "Toute catégorie",
          options: categories.map(c => ({ value: c.id, label: c.name })) },
      ]}
      dates={{
        from: { value: fromDate, mode: "month", onChange: e => setDFrom(e.target.value) },
      }}
    />
  );

  return (
    <div className="pageBloc">
      <Banner
        title={`${totalItems} Budgets`}
        callToAction={<CallToAction1 title="Nouveau budget" iconSrc={addIcon} action={handleNewBudgetDialog} />}
        filterContent={filterBlock}
      />

      <div className="block-filter-desktop">{filterBlock}</div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px",
        border: "1px solid #0000001a",
        borderRadius: "20px",
        background: "white",
      }}>

        {loading && <p style={{ textAlign: "center", color: "#9ca3af" }}>Chargement...</p>}
        {error   && <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: "12px" }}>
              {pageItems.length > 0 ? pageItems.map((budget) => (
                <BudgetBox
                  onClick={() => handleBudgetDetailsDialog(budget)}
                  key={budget.id}
                  id={budget.id}
                  category={categories.find(c => c.id === budget.category_id)?.name ?? "-"}
                  date={`${String(budget.month).padStart(2, "0")}/${budget.year}`}
                  amountLimit={budget.amount_limit}
                  spentAmount={budget.spent_amount}
                />
              )) : (
                <p style={{ textAlign: "center", color: "#9ca3af", width: "100%" }}>Aucun budget trouvé</p>
              )}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              from={from}
              to={to}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Budgets;