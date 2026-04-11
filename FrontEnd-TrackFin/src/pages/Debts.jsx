import { useState, useEffect, useMemo } from "react";
import Banner from "../components/Banner";
import { useDialog } from "../context/DialogContext";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import DebtBox from "../components/DebtBox";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import { getDebts, createDebt, deleteDebt, updateDebt, payDebt } from "../services/DebtServices";
import { getContacts } from "../services/ContactServices";
import { getPaymentMethods } from "../services/PaymentMethodsServices";

function Debts() {

  const [debts, setDebts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("");

  const { openDialog } = useDialog();

  useEffect(() => {
    async function fetchDebts() {
      try {
        setLoading(true);
        const data = await getDebts();
        const data2 = await getContacts();
        const data3 = await getPaymentMethods();
        setDebts(data.debts);
        setContacts(data2.contacts);
        setPaymentMethods(data3.payment_methods);
      } catch (err) {
        setError(err.message ?? "Erreur lors du chargement des dettes");
      } finally {
        setLoading(false);
      }
    }
    fetchDebts();
  }, []);

  const refreshDebts = async () => {
    try {
      setLoading(true);
      const data = await getDebts();
      setDebts(data.debts);
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des dettes");
    } finally {
      setLoading(false);
    }
  };

  const handleNewDebtDialog = async () => {
    openDialog({
      title: "Ajouter une dette",
      fields: [
        { key: "amount", type: "number", label: "Montant", required: true },
        { key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "to_pay", label: "A payer" }, { value: "to_receive", label: "A recevoir" }] },
        { key: "notes", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        { key: "status", type: "select", label: "Status", required: true,
          options: [{ value: "pending", label: "En attente" }] },
        { key: "contact_id", type: "select", label: "Client/Fournisseur", required: true,
          options: contacts.map(c => ({ value: c.id, label: c.name })) },
        { key: "due_date", type: "date", label: "Date d'échéance", required: true },
      ],
      onSubmit: async (values) => {
        try {
          await createDebt(values);
          await refreshDebts();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handleDebtDetailsDialog = (debt) => {
    openDialog({
      title: "Détails dette — " + debt.contact?.name,
      initialValues: {
        amount: debt.amount,
        type: debt.type,
        notes: debt.notes,
        status: debt.status,
        contact_id: debt.contact_id,
        due_date: debt.due_date?.split("T")[0],
      },
      fields: [
        { key: "amount", type: "number", label: "Montant", required: true, disabled: debt.status !== "pending" },
        { key: "type", type: "select", label: "Type", required: true, disabled: true,
          options: [{ value: "to_pay", label: "A payer" }, { value: "to_receive", label: "A recevoir" }] },
        { key: "notes", type: "textarea", label: "Description", rows: 3, fullWidth: true, disabled: debt.status !== "pending" },
        { key: "status", type: "select", label: "Status", required: true, disabled: true,
          options: [
            { value: "pending", label: "En attente" },
            { value: "partially_paid", label: "Partiellement payé" },
            { value: "paid", label: "Payée" },
          ] },
        { key: "contact_id", type: "select", label: "Client/Fournisseur", required: true, disabled: true,
          options: contacts.map(c => ({ value: c.id, label: c.name })) },
        { key: "due_date", type: "date", label: "Date d'échéance", required: true, disabled: debt.status !== "pending" },
      ],
      disabledSubmit: debt.rest_to_pay < debt.amount,
      onSubmit: async (values) => {
        try {
          await updateDebt(debt.id, values);
          refreshDebts();
        } catch (error) {
          alert(error.message);
        }
      },
      onDelete: async () => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette dette " + debt.id + " ?\nLes transactions liées ne seront pas supprimées.");
        if (confirmed) {
          try {
            await deleteDebt(debt.id);
            refreshDebts();
          } catch (error) {
            alert(error.message);
          }
        }
      },
    });
  };

  const handleDebtPayementsDialog = (debt) => {
    openDialog({
      title: "Payement de dette — " + debt.contact?.name,
      subtitle: "Montant total : " + debt.amount + " " + import.meta.env.VITE_CURRENCY + " | Reste à payer : " + debt.rest_to_pay + " " + import.meta.env.VITE_CURRENCY,
      buttonLabel: "Enregistrer le payement",
      initialValues: {
        amount: debt.rest_to_pay,
        description: debt.notes,
        date: new Date().toISOString().split("T")[0],
      },
      fields: [
        { key: "amount", type: "number", label: "Montant", required: true, max: debt.rest_to_pay, min: 0 },
        { key: "date", type: "date", label: "Date", required: true, disabled: true },
        { key: "description", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        { key: "payment_method_id", type: "select", label: "Moyen de paiement", required: true,
          options: paymentMethods.map(m => ({ value: m.id, label: m.name })) },
      ],
      onSubmit: async (values) => {
        try {
          await payDebt(debt.id, values);
          refreshDebts();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {
      if (q) {
        const search = q.toLowerCase();
        const matchId      = String(debt.id).includes(search);
        const matchContact = debt.contact?.name?.toLowerCase().includes(search);
        const matchNote    = debt.notes?.toLowerCase().includes(search);
        if (!matchId && !matchContact && !matchNote) return false;
      }
      if (type   && debt.type             !== type)   return false;
      if (client && debt.contact?.type    !== client) return false;
      if (status && debt.status           !== status) return false;
      return true;
    });
  }, [debts, q, type, client, status]);

  // ── Pagination ──────────────────────────────────────────────────
  const { page, setPage, pageItems, totalPages, totalItems, from, to } =
    usePagination(filteredDebts, 15);

  const filterBlock = (
    <BlockFilter
      search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, contact, note..." }}
      selects={[
        { value: type, onChange: e => setType(e.target.value), placeholder: "Type dette",
          options: [{ value: "to_pay", label: "A payer" }, { value: "to_receive", label: "A recevoir" }] },
        { value: client, onChange: e => setClient(e.target.value), placeholder: "Type contact",
          options: [{ value: "client", label: "Client" }, { value: "supplier", label: "Fournisseur" }, { value: "contact", label: "Autre" }] },
        { value: status, onChange: e => setStatus(e.target.value), placeholder: "Statut",
          options: [{ value: "pending", label: "En attente" }, { value: "partially_paid", label: "Partiellement payé" }, { value: "paid", label: "Payée" }] },
      ]}
    />
  );

  return (
    <div className="pageBloc">
      <Banner
        title={`${totalItems} Dettes`}
        callToAction={<CallToAction1 title="Nouvelle dette" iconSrc={addIcon} action={handleNewDebtDialog} />}
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
            {pageItems.length > 0 ? pageItems.map((debt) => (
              <DebtBox
                key={debt.id}
                onClick={() => handleDebtDetailsDialog(debt)}
                onPay={() => handleDebtPayementsDialog(debt)}
                id={debt.id}
                type={debt.type === "to_pay" ? "A payer" : "A recevoir"}
                typeContact={debt.contact?.type === "supplier" ? "Fournisseur" : debt.contact?.type === "client" ? "Client" : "Contact"}
                nameContact={debt.contact?.name ?? "Contact inconnu"}
                date={debt.due_date ? new Date(debt.due_date).toLocaleDateString("fr-FR") : "Date non définie"}
                status={
                  debt.status === "pending"        ? "En attente" :
                  debt.status === "partially_paid" ? "Partiellement payé" :
                  debt.status === "paid"           ? "Payée" : debt.status
                }
                note={debt.notes}
                mount={debt.amount}
                restToPay={debt.rest_to_pay}
              />
            )) : (
              <p style={{ textAlign: "center", color: "#9ca3af" }}>Aucune dette trouvée</p>
            )}

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

export default Debts;