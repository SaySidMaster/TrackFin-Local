import { useState, useEffect, useMemo  } from "react";
import Banner from "../components/Banner";
import { useDialog } from "../context/DialogContext";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import DebtBox from "../components/DebtBox";
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

  // ── Chargement initial ──────────────────────────────────────────
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
  }, []); // [] = une seule fois au montage

  // ── Rafraichir a liste ────────────────────────────────────────────────────
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


  // ── Handlers ───────────────────────────────────────────────────
  const handleNewDebtDialog = async (e) => {
    openDialog({
      title: "Ajouter une dette",
      fields: [
        { key: "amount", type: "number", label: "Montant", required: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "to_pay", label: "A payer" }, { value: "to_receive", label: "A recevoir" }]
        },
        { key: "notes", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        {
          key: "status", type: "select", label: "Status", required: true,
          options: [{ value: "pending", label: "En attente" }]
        },
        {
          key: "contact_id", type: "select", label: "Client/Fournisseur", required: true,
          options: contacts.map(contact => ({ value: contact.id, label: contact.name })) // à remplacer par les contacts réels de l'utilisateur
        },
        { key: "due_date", type: "date", label: "Date d'échéance", required: true },
      ],
      onSubmit: async (values) => {
        try {
          await createDebt(values);
          // Option 1 : Recharger la liste complète depuis l'API
          const data = await getDebts();
          refreshDebts();

          // Option 2 : Ajouter la nouvelle dette directement au debut dans le state grâce aux infos de data (moins de charge, mais risque de désynchronisation)
          setDebts(prev => [data.debt, ...prev]);
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handleDebtDetailsDialog = (debt) => {
    openDialog({
      title: "Détails dette — " + debt.contact?.name,

      // ── Toutes les valeurs initiales en un seul objet ──
      initialValues: {
        amount: debt.amount,
        type: debt.type,
        notes: debt.notes,
        status: debt.status,
        contact_id: debt.contact_id,
        due_date: debt.due_date?.split("T")[0], // format YYYY-MM-DD pour <input type="date">
      },

      fields: [
        { key: "amount", type: "number", label: "Montant", required: true, disabled: debt.status !== "pending" },
        {
          key: "type", type: "select", label: "Type", required: true, disabled: true,
          options: [{ value: "to_pay", label: "A payer" }, { value: "to_receive", label: "A recevoir" }]
        },
        { key: "notes", type: "textarea", label: "Description", rows: 3, fullWidth: true, disabled: debt.status !== "pending" },
        {
          key: "status", type: "select", label: "Status", required: true, disabled: true,
          options: [
            { value: "pending", label: "En attente" },
            { value: "partially_paid", label: "Partiellement payé" },
            { value: "paid", label: "Payée" },
          ]
        },
        {
          key: "contact_id", type: "select", label: "Client/Fournisseur", required: true, disabled: true,
          options: contacts.map(contact => ({ value: contact.id, label: contact.name }))
        },
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
      onDelete: async (id) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette dette " + debt.id + " ?\nLes transaction lié ne seront pas supprimées.");
        if (confirmed) {
          try {
            await deleteDebt(debt.id);
            refreshDebts();
          } catch (error) {
            alert(error.message);
          }
        }
      }
    });
  };

  const handleDebtPayementsDialog = (debt) => {
    openDialog({
      title: "Payement de dette — " + debt.contact?.name,
      subtitle: "Montant total : " + debt.amount + " " + import.meta.env.VITE_CURRENCY + " | Reste à payer : " + debt.rest_to_pay + " " + import.meta.env.VITE_CURRENCY,
      buttonLabel: "Enregistrer le payement",
      // ── Toutes les valeurs initiales en un seul objet ──
      initialValues: {
        amount: debt.rest_to_pay,
        description: debt.notes,
        date: new Date().toISOString().split("T")[0], // date du jour au format YYYY-MM-DD pour <input type="date">
      },

      fields: [
        { key: "amount", type: "number", label: "Montant", required: true, max: debt.rest_to_pay, min: 0 },
        { key: "date", type: "date", label: "Date", required: true, disabled: true },
        { key: "description", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        {
          key: "payment_method_id", type: "select", label: "Moyen de paiement", required: true,
          options: paymentMethods.map(method => ({ value: method.id, label: method.name }))
        },
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

  // ── Filtrage ───────────────────────────────────────────────────
  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {

      // Recherche textuelle — id, nom du contact, note
      if (q) {
        const search = q.toLowerCase();
        const matchId = String(debt.id).includes(search);
        const matchContact = debt.contact?.name?.toLowerCase().includes(search);
        const matchNote = debt.notes?.toLowerCase().includes(search);
        if (!matchId && !matchContact && !matchNote) return false;
      }

      // Filtre type (to_pay / to_receive)
      if (type && debt.type !== type) return false;

      // Filtre type de contact (customer / supplier)
      if (client && debt.contact?.type !== client) return false;

      // Filtre statut
      if (status && debt.status !== status) return false;

      return true;
    });
  }, [debts, q, type, client, status]);

  // ── Rendu ──────────────────────────────────────────────────────
  return (
    <div className="pageBloc">
      <Banner
        title={`${filteredDebts.length} Dettes`}
        callToAction={<CallToAction1 title="Nouvelle dette" iconSrc={addIcon} action={handleNewDebtDialog} />}
      />

      <BlockFilter
        search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, contact, note..." }}
        selects={[
          {
            value: type, onChange: e => setType(e.target.value),
            placeholder: "Type dette",
            options: [
              { value: "to_pay", label: "A payer" },
              { value: "to_receive", label: "A recevoir" },
            ]
          },
          {
            value: client, onChange: e => setClient(e.target.value),
            placeholder: "Type contact",
            options: [
              { value: "client", label: "Client" },
              { value: "supplier", label: "Fournisseur" },
              { value: "contact", label: "Autre" },
            ]
          },
          {
            value: status, onChange: e => setStatus(e.target.value),
            placeholder: "Statut",
            options: [
              { value: "pending", label: "En attente" },
              { value: "partially_paid", label: "Partiellement payé" },
              { value: "paid", label: "Payée" },
            ]
          },
        ]}
      />

      <div className="ScrollableDiv" style={{
        height: "75vh",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px",
        border: "1px solid #0000001a",
        borderRadius: "20px",
      }}>

        {/* États de chargement et d'erreur */}
        {loading && <p style={{ textAlign: "center", color: "#9ca3af" }}>Chargement...</p>}
        {error && <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>}

        {/* Liste des dettes */}
        {!loading && !error && filteredDebts.map((debt) => (
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
              debt.status === "pending" ? "En attente" :
                debt.status === "partially_paid" ? "Partiellement payé" :
                  debt.status === "paid" ? "Payée" : debt.status
            }
            note={debt.notes}
            mount={debt.amount}
            restToPay={debt.rest_to_pay}
          />
        ))}

        {/* Liste vide */}
        {!loading && !error && debts.length === 0 && (
          <p style={{ textAlign: "center", color: "#9ca3af" }}>Aucune dette trouvée</p>
        )}

      </div>
    </div>
  );
}

export default Debts;