import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import ContactBox from "../components/ContactBox";
import { useDialog } from "../context/DialogContext";
import { useState } from "react";

function Contacts() {

  const [q, setQ] = useState("");
  const [type, setType] = useState("");


  const { openDialog } = useDialog();

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
      onSubmit: (values) => console.log("Nouveau contact:", values),
    });
  };

  const handleContactDetailsDialog = async (id) => {
    openDialog({
      title: "Détails du contact " + id,
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
      onSubmit: (values) => console.log("Détails du contact:", values),
    });
  };

  return (
    <div className="pageBloc">
      <Banner title="Clients & Fournisseurs" callToAction={<CallToAction1 title="Nouveau contact" iconSrc={addIcon} action={handleNewContactDialog} />} />
      <BlockFilter
        search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, libellé,..." }}
        selects={[
          { value: type, onChange: e => setType(e.target.value), placeholder: "Tout type", options: [] },
        ]}
      />

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


        {[...Array(15)].map((_, i) => (
          <ContactBox
            onClick={() => handleContactDetailsDialog(i)}
            key={i}
            id={i}
            type={i % 2 === 0 ? "Client" : "Fournisseur"}
            name={i % 2 === 0 ? "Jean Dupont" : "Marie Martin"}
            number={i % 2 === 0 ? "01 23 45 67 89" : "02 34 56 78 90"}
            email={i % 2 === 0 ? "jean.dupont@email.com" : "marie.martin@email.com"}
          />
        ))}
      </div>
    </div>
  );
}

export default Contacts;