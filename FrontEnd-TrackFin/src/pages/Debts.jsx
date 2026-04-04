import { useState, useEffect } from "react";
import Banner from "../components/Banner";
import { useDialog } from "../context/DialogContext";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import DebtBox from "../components/DebtBox";
import { getDebts } from "../services/DebtServices";
import { getContacts } from "../services/ContactServices";

function Debts() {

  const [debts, setDebts] = useState([]);
  const [contacts, setContacts] = useState([]);
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
        setDebts(data.debts);
        setContacts(data2.contacts);
      } catch (err) {
        setError(err.message ?? "Erreur lors du chargement des dettes");
      } finally {
        setLoading(false);
      }
    }

    fetchDebts();
  }, []); // [] = une seule fois au montage

  // ── Dialogs ────────────────────────────────────────────────────
  const handleNewDebtDialog = async (e) => {
    openDialog({
      title: "Ajouter une dette",
      fields: [
        { key: "amount", type: "number", label: "Montant", required: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }]
        },
        { key: "note", type: "textarea", label: "Description", rows: 3, fullWidth: true },
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
      onSubmit: (values) => console.log("Nouvelle dette:", values),
    });
  };

  const handleDebtDetailsDialog = (debt) => {
    openDialog({
      title: "Détails dette — " + debt.contact?.name,

      // ── Toutes les valeurs initiales en un seul objet ──
      initialValues: {
        amount: debt.amount,
        type: debt.type,
        note: debt.notes,
        status: debt.status,
        contact_id: debt.contact_id,
        date: debt.due_date?.split("T")[0], // format YYYY-MM-DD pour <input type="date">
      },

      fields: [
        { key: "amount", type: "number", label: "Montant", required: true },
        {
          key: "type", type: "select", label: "Type", required: true, disabled: true,
          options: [{ value: "to_pay", label: "A payer" }, { value: "to_receive", label: "A recevoir" }]
        },
        { key: "note", type: "textarea", label: "Description", rows: 3, fullWidth: true },
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
        { key: "due_date", type: "date", label: "Date d'échéance", required: true },
      ],

      onSubmit: (values) => console.log("Mise à jour dette:", values),
    });
  };

  const handleDebtPayementsDialog = (debt) => {
    openDialog({
      title: "Payement de dette — " + debt.contact?.name,
      subtitle: "Montant total : " + debt.amount + " " + import.meta.env.VITE_CURRENCY + " | Reste à payer : " + debt.rest_to_pay + " " + import.meta.env.VITE_CURRENCY,
      buttonLabel: "Enregistrer le payement",
      // ── Toutes les valeurs initiales en un seul objet ──
      initialValues: {
        amount: debt.amount,
        description: debt.notes,
        date:new Date().toISOString().split("T")[0], // date du jour au format YYYY-MM-DD pour <input type="date">
      },

      fields: [
        { key: "amount", type: "number", label: "Montant", required: true, max: debt.rest_to_pay, min: 0 },
        { key: "date", type: "date", label: "Date", required: true , disabled: true },
        { key: "description", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        
      ],

      onSubmit: (values) => console.log("Mise à jour dette:", values),
    });
  };

  // ── Rendu ──────────────────────────────────────────────────────
  return (
    <div className="pageBloc">
      <Banner
        title={`${debts.length} Dettes`}
        callToAction={<CallToAction1 title="Nouvelle dette" iconSrc={addIcon} action={handleNewDebtDialog} />}
      />

      <BlockFilter
        search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, libellé,..." }}
        selects={[
          { value: type, onChange: e => setType(e.target.value), placeholder: "Type dette", options: [] },
          { value: client, onChange: e => setClient(e.target.value), placeholder: "Type client", options: [] },
          { value: status, onChange: e => setStatus(e.target.value), placeholder: "Type status", options: [] },
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
        {!loading && !error && debts.map((debt) => (
          <DebtBox
            key={debt.id}
            onClick={() => handleDebtDetailsDialog(debt)}
            onPay={() => handleDebtPayementsDialog(debt)}
            id={debt.id}
            type={debt.type === "to_pay" ? "A payer" : "A recevoir"}
            typeContact={debt.contact?.type === "supplier" ? "Fournisseur" : debt.contact?.type === "customer" ? "Client" : "Contact"}
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