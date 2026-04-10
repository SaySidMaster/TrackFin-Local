import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import ContactBox from "../components/ContactBox";
import { useDialog } from "../context/DialogContext";
import { useState, useEffect, useMemo } from "react";
import { getContacts, createContact, deleteContact, updateContact } from "../services/ContactServices";

function Contacts() {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [type, setType] = useState("");

  const { openDialog } = useDialog();

  // ── Chargement initial ──────────────────────────────────────────
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

  // ── Rafraichir la liste ────────────────────────────────────────────────────
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

  const handleNewContactDialog = async (e) => {
    openDialog({
      title: "Ajouter un contact",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "phone", type: "text", label: "Numéro de téléphone", required: true },
        { key: "email", type: "email", label: "Email", required: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "client", label: "Client" }, { value: "supplier", label: "Fournisseur" }]
        },
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
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        type: contact.type,
        notes: contact.notes,
      },
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "phone", type: "text", label: "Numéro de téléphone", required: true },
        { key: "email", type: "email", label: "Email", required: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "client", label: "Client" }, { value: "supplier", label: "Fournisseur" }]
        },
        { key: "notes", type: "textarea", label: "Note", placeholder: "...", rows: 4 },
      ],
      onDelete: async (id) => {
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

  // ── Filtrage ───────────────────────────────────────────────────
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Recherche textuelle — id, nom, email, téléphone
      if (q) {
        const search = q.toLowerCase();
        const matchId = String(contact.id).includes(search);
        const matchName = contact.name?.toLowerCase().includes(search);
        const matchEmail = contact.email?.toLowerCase().includes(search);
        const matchPhone = contact.phone?.toLowerCase().includes(search);
        if (!matchId && !matchName && !matchEmail && !matchPhone) return false;
      }

      // Filtre type
      if (type && contact.type !== type) return false;

      return true;
    });
  }, [contacts, q, type]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  // Bloc filtre partagé — rendu inline en desktop, popup en mobile via Banner
  const filterBlock = (
    <BlockFilter
        search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, nom, email, téléphone..." }}
        selects={[
          { value: type, onChange: e => setType(e.target.value), placeholder: "Tout type", options: [{ value: "client", label: "Client" }, { value: "supplier", label: "Fournisseur" }] },
        ]}
      />
  )

  return (
    <div className="pageBloc">
      <Banner title={`${filteredContacts.length} Clients & Fournisseurs`} 
      callToAction={<CallToAction1 title="Nouveau contact" iconSrc={addIcon} action={handleNewContactDialog} />}
      filterContent={filterBlock} />

      {/* Contenu de la page Contacts */}
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


        {filteredContacts.map((contact) => (
          <ContactBox
            onClick={() => handleContactDetailsDialog(contact)}
            key={contact.id}
            id={contact.id}
            type={contact.type === "client" ? "Client" : "Fournisseur"}
            name={contact.name}
            number={contact.phone}
            email={contact.email}
          />
        ))}
      </div>
    </div>
  );
}

export default Contacts;