import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import Pagination from "../components/Pagination";           // ← nouveau
import { useDialog } from "../context/DialogContext";
import { useState, useEffect, useMemo } from "react";
import { usePagination } from "../hooks/usePagination";     // ← nouveau
import { getTransactions, createTransaction, deleteTransaction, updateTransaction } from "../services/TransactionServices";
import { getContacts } from "../services/ContactServices";
import { getCategories } from "../services/CategoryServices";
import { getPaymentMethods } from "../services/PaymentMethodsServices";


function Transactions() {
  const currency = import.meta.env.VITE_CURRENCY;

  const [transactions, setTransactions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [cat, setCat] = useState("");
  const [payMet, setPayMet] = useState("");
  const [minPrice, setPMin] = useState("");
  const [maxPrice, setPMax] = useState("");
  const [fromDate, setDFrom] = useState("");
  const [toDate, setDTo] = useState("");

  const { openDialog } = useDialog();

  // ── Chargement initial ──────────────────────────────────────────
  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        const data = await getTransactions();
        const data2 = await getContacts();
        const data3 = await getCategories();
        const data4 = await getPaymentMethods();
        setTransactions(data.transactions);
        setContacts(data2.contacts);
        setCategories(data3.categories);
        setPaymentMethods(data4.payment_methods);
      } catch (err) {
        setError(err.message ?? "Erreur lors du chargement des transactions");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  // ── Rafraichir la liste ─────────────────────────────────────────
  const refreshTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data.transactions);
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransactionDialog = async () => {
    openDialog({
      title: "Ajouter une transaction",
      initialValues: { date: new Date().toISOString().split("T")[0] },
      fields: [
        { key: "label", type: "text", label: "Label", required: true },
        { key: "date", type: "date", label: "Date", required: true },
        { key: "amount", type: "number", label: "Montant", required: true },
        { key: "description", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        { key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }] },
        { key: "contact_id", type: "select", label: "Client/Fournisseur", required: true,
          options: contacts.map(c => ({ value: c.id, label: c.name })) },
        { key: "category_id", type: "select", label: "Catégorie", required: true,
          options: categories.map(c => ({ value: c.id, label: c.name })) },
        { key: "payment_method_id", type: "select", label: "Méthode de paiement", required: true,
          options: paymentMethods.map(m => ({ value: m.id, label: m.name })) },
      ],
      onSubmit: async (values) => {
        try {
          await createTransaction(values);
          await refreshTransactions();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handleTransactionDetailsDialog = async (transaction) => {
    openDialog({
      title: "Détails de la transaction " + transaction.id,
      initialValues: {
        label: transaction.label ?? transaction.description ?? "",
        date: transaction.date ? transaction.date.split("T")[0] : transaction.created_at ? transaction.created_at.split("T")[0] : "",
        amount: transaction.amount,
        description: transaction.description ?? "",
        type: transaction.type,
        payment_method_id: transaction.payment_method_id ?? "",
        contact_id: transaction.contact_id,
        category_id: transaction.category_id,
      },
      fields: [
        { key: "label", type: "text", label: "Label", required: true, disabled: true },
        { key: "date", type: "date", label: "Date", required: true, disabled: true },
        { key: "amount", type: "number", label: "Montant", required: true, disabled: true },
        { key: "description", type: "textarea", label: "Description", rows: 3, fullWidth: true },
        { key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }] },
        { key: "contact_id", type: "select", label: "Client/Fournisseur", required: true, disabled: true,
          options: contacts.map(c => ({ value: c.id, label: c.name })) },
        { key: "category_id", type: "select", label: "Catégorie", required: true,
          options: categories.map(c => ({ value: c.id, label: c.name })) },
        { key: "payment_method_id", type: "select", label: "Méthode de paiement", required: true,
          options: paymentMethods.map(m => ({ value: m.id, label: m.name })) },
      ],
      onDelete: async () => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction " + transaction.id + " ?");
        if (confirmed) {
          try {
            await deleteTransaction(transaction.id);
            await refreshTransactions();
          } catch (error) {
            alert(error.message);
          }
        }
      },
      onSubmit: async (values) => {
        try {
          await updateTransaction(transaction.id, values);
          await refreshTransactions();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  // ── Filtrage ────────────────────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (q) {
        const search = q.toLowerCase();
        const matchId = String(transaction.id).includes(search);
        const matchDescription = transaction.description?.toLowerCase().includes(search);
        const matchCategory = transaction.category?.name?.toLowerCase().includes(search)
          || String(transaction.category_id).includes(search);
        const matchContact = transaction.contact_id
          ? contacts.find(c => String(c.id) === String(transaction.contact_id))?.name?.toLowerCase().includes(search)
          : false;
        if (!matchId && !matchDescription && !matchCategory && !matchContact) return false;
      }
      if (type && transaction.type !== type) return false;
      if (cat && String(transaction.category_id) !== String(cat)) return false;
      if (payMet && String(transaction.payment_method_id) !== String(payMet)) return false;
      if (minPrice && Number(transaction.amount) < Number(minPrice)) return false;
      if (maxPrice && Number(transaction.amount) > Number(maxPrice)) return false;
      const transactionDate = transaction.created_at || transaction.date || transaction.updated_at;
      if (fromDate && transactionDate && new Date(fromDate) > new Date(transactionDate)) return false;
      if (toDate && transactionDate && new Date(toDate) < new Date(transactionDate)) return false;
      return true;
    });
  }, [transactions, q, type, cat, payMet, minPrice, maxPrice, fromDate, toDate]);

  // ── Pagination — sur filteredTransactions ───────────────────────
  const { page, setPage, pageItems, totalPages, totalItems, from, to } =
    usePagination(filteredTransactions, 20); // ← 20 lignes par page

  // ── Bloc filtre partagé ─────────────────────────────────────────
  const filterBlock = (
    <BlockFilter
      search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, libellé,..." }}
      selects={[
        { value: type, onChange: e => setType(e.target.value), placeholder: "Tout type",
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }] },
        { value: cat, onChange: e => setCat(e.target.value), placeholder: "Toute catégorie",
          options: categories.map(c => ({ value: c.id, label: c.name })) },
        { value: payMet, onChange: e => setPayMet(e.target.value), placeholder: "Tout moyen de paiement",
          options: paymentMethods.map(m => ({ value: m.id, label: m.name })) },
      ]}
      amounts={{
        min: { value: minPrice, onChange: e => setPMin(e.target.value), placeholder: "Montant min" },
        max: { value: maxPrice, onChange: e => setPMax(e.target.value), placeholder: "Montant max" },
      }}
      dates={{
        from: { value: fromDate, onChange: e => setDFrom(e.target.value), placeholder: "Date début" },
        to: { value: toDate, onChange: e => setDTo(e.target.value), placeholder: "Date fin" },
      }}
    />
  );

  return (
    <div className="pageBloc">

      <Banner
        title={`${totalItems} Transactions`}
        callToAction={<CallToAction1 title="Nouvelle transaction" iconSrc={addIcon} action={handleNewTransactionDialog} />}
        filterContent={filterBlock}
      />

      <div className="block-filter-desktop">{filterBlock}</div>

      <div style={{ height: "auto" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          background: "white",
          padding: "10px",
          borderRadius: "20px",
        }}>
          <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column"}}>

            {loading && <p style={{ textAlign: "center", color: "#9ca3af" }}>Chargement...</p>}
            {error   && <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>}

            {!loading && !error && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  {/* THEAD */}
                  <thead>
                    <tr style={{
                      display: "table",
                      width: "100%",
                      tableLayout: "fixed",
                      height: "50px",
                      color: "#0000007c",
                      fontWeight: "500",
                      borderBottom: "1px solid #b8b4b471",
                      fontSize: "14px",
                    }}>
                      <th className="trxCol1" style={{ textAlign: "left",  width: "100px" }}>Libellé</th>
                      <th className="trxCol2" style={{ textAlign: "left",  width: "100px" }}>Contact</th>
                      <th className="trxCol3" style={{ textAlign: "right", width: "150px" }}>Montant ({currency})</th>
                      <th className="trxCol4" style={{ textAlign: "right", width: "150px" }}>Catégorie</th>
                      <th className="trxCol5" style={{ textAlign: "right", width: "150px" }}>Date</th>
                    </tr>
                  </thead>

                  {/* TBODY — pageItems à la place de filteredTransactions */}
                  <tbody style={{ display: "block", overflowY: "auto", fontSize: "14px" }}>
                    {pageItems.length > 0 ? pageItems.map((transaction) => {
                      const categoryName = transaction.category?.name
                        || categories.find(c => String(c.id) === String(transaction.category_id))?.name
                        || "-";
                      const date = transaction.created_at || transaction.date || transaction.updated_at;
                      const formattedDate = date ? new Date(date).toLocaleDateString("fr-FR") : "-";

                      return (
                        <tr
                          onClick={() => handleTransactionDetailsDialog(transaction)}
                          key={transaction.id}
                          style={{
                            cursor: "pointer",
                            display: "table",
                            width: "100%",
                            tableLayout: "fixed",
                            height: "50px",
                            marginBottom: "10px",
                          }}
                        >
                          <td className="trxCol1" style={{ textAlign: "left", width: "100px" }}>
                            <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {transaction.label ?? transaction.description}
                            </span>
                            <span style={{ fontSize: "12px", color: "#6b7280" }}>
                              {transaction.type === "income" ? "Revenu" : "Dépense"}
                            </span>
                          </td>
                          <td className="trxCol2" style={{ textAlign: "left", width: "100px" }}>
                            <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {contacts.find(c => String(c.id) === String(transaction.contact_id))?.name || "-"}
                            </span>
                            <span style={{ fontSize: "12px", color: "#6b7280" }}>
                              {contacts.find(c => String(c.id) === String(transaction.contact_id))?.type || "-"}
                            </span>
                          </td>
                          <td className="trxCol3" style={{ textAlign: "right", width: "150px" }}>
                            {transaction.amount}<br />
                            <span style={{ fontSize: "12px", color: "#6b7280" }}>
                              {paymentMethods.find(m => String(m.id) === String(transaction.payment_method_id))?.name || "-"}
                            </span>
                          </td>
                          <td className="trxCol4" style={{ textAlign: "right", width: "150px" }}>{categoryName}</td>
                          <td className="trxCol5" style={{ textAlign: "right", width: "150px" }}>{formattedDate}</td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "25px 0", color: "#6b7280" }}>
                          Aucune transaction trouvée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* ── Pagination ── */}
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
      </div>
    </div>
  );
}

export default Transactions;