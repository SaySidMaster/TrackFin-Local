import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import ContactBox from "../components/ContactBox";
import Pagination from "../components/Pagination";
import { useDialog } from "../context/DialogContext";
import { useState, useEffect, useMemo } from "react";
import { usePagination } from "../hooks/usePagination";
import { getContacts, createContact, deleteContact, updateContact } from "../services/ContactServices";

function Contacts() {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [type, setType] = useState("");

  const { openDialog } = useDialog();

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        const data = await getContacts();
        setContacts(data.contacts);
      } catch (err) {
        setError(err.message ?? "Erreur lors du chargement des contacts");
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  const refreshContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data.contacts);
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleNewContactDialog = async () => {
    openDialog({
      title: "Ajouter un contact",
      fields: [
        { key: "name",  type: "text",     label: "Nom",                  required: true },
        { key: "phone", type: "text",     label: "Numéro de téléphone",  required: true },
        { key: "email", type: "email",    label: "Email",                required: true },
        { key: "type",  type: "select",   label: "Type",                 required: true,
          options: [{ value: "client", label: "Client" }, { value: "supplier", label: "Fournisseur" }] },
        { key: "notes", type: "textarea", label: "Note", placeholder: "...", rows: 4 },
      ],
      onSubmit: async (values) => {
        try {
          await createContact(values);
          await refreshContacts();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handleContactDetailsDialog = async (contact) => {
    openDialog({
      title: "Détails du contact — " + contact.name,
      initialValues: {
        name:  contact.name,
        phone: contact.phone,
        email: contact.email,
        type:  contact.type,
        notes: contact.notes,
      },
      fields: [
        { key: "name",  type: "text",     label: "Nom",                  required: true },
        { key: "phone", type: "text",     label: "Numéro de téléphone",  required: true },
        { key: "email", type: "email",    label: "Email",                required: true },
        { key: "type",  type: "select",   label: "Type",                 required: true,
          options: [{ value: "client", label: "Client" }, { value: "supplier", label: "Fournisseur" }] },
        { key: "notes", type: "textarea", label: "Note", placeholder: "...", rows: 4 },
      ],
      onDelete: async () => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce contact " + contact.name + " ?");
        if (confirmed) {
          try {
            await deleteContact(contact.id);
            await refreshContacts();
          } catch (error) {
            alert(error.message);
          }
        }
      },
      onSubmit: async (values) => {
        try {
          await updateContact(contact.id, values);
          await refreshContacts();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      if (q) {
        const search = q.toLowerCase();
        const matchId    = String(contact.id).includes(search);
        const matchName  = contact.name?.toLowerCase().includes(search);
        const matchEmail = contact.email?.toLowerCase().includes(search);
        const matchPhone = contact.phone?.toLowerCase().includes(search);
        if (!matchId && !matchName && !matchEmail && !matchPhone) return false;
      }
      if (type && contact.type !== type) return false;
      return true;
    });
  }, [contacts, q, type]);

  // ── Pagination ──────────────────────────────────────────────────
  const { page, setPage, pageItems, totalPages, totalItems, from, to } =
    usePagination(filteredContacts, 20);

  const filterBlock = (
    <BlockFilter
      search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, nom, email, téléphone..." }}
      selects={[
        { value: type, onChange: e => setType(e.target.value), placeholder: "Tout type",
          options: [{ value: "client", label: "Client" }, { value: "supplier", label: "Fournisseur" }] },
      ]}
    />
  );

  return (
    <div className="pageBloc">
      <Banner
        title={`${totalItems} Clients & Fournisseurs`}
        callToAction={<CallToAction1 title="Nouveau contact" iconSrc={addIcon} action={handleNewContactDialog} />}
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {pageItems.length > 0 ? pageItems.map((contact) => (
                <ContactBox
                  onClick={() => handleContactDetailsDialog(contact)}
                  key={contact.id}
                  id={contact.id}
                  type={contact.type === "client" ? "Client" : "Fournisseur"}
                  name={contact.name}
                  number={contact.phone}
                  email={contact.email}
                />
              )) : (
                <p style={{ textAlign: "center", color: "#9ca3af", width: "100%" }}>Aucun contact trouvé</p>
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

export default Contacts;