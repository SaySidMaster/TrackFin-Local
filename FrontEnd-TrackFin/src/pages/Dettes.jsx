import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
import DeptBox from "../components/DeptBox";
import { useState } from "react";

function Dettes() {

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div className="pageBloc">
      <Banner title="15 Dettes" callToAction={<CallToAction1 title="Nouvelle dette" iconSrc={addIcon} action={() => {}} />}/>

      <BlockFilter
        search={{ value: q, onChange: e => setQ(e.target.value), placeholder: "Recherche, id, libellé,..." }}
        selects={[
          { value: type, onChange: e => setType(e.target.value), placeholder: "Type dette", options: [] },
          { value: client, onChange: e => setClient(e.target.value), placeholder: "Type client", options: [] },
          { value: status, onChange: e => setStatus(e.target.value), placeholder: "Type status", options: [] },
        ]}
      />


      {/* Contenu de la page Transactions */}

      <div className="ScrollableDiv" style={{ 
        height: "75vh", 
        display: "flex", 
        flexDirection: "column", 
        gap: "12px", 
        padding: "20px", 
        border: "1px solid #0000001a", 
        borderRadius:"20px",
          }}>


              {[...Array(15)].map((_, i) => (
                <DeptBox 
                  key={i}
                  id={i}
                  type={i % 2 === 0 ? "A payer" : "A recevoir"}
                  typeContact={i % 2 === 0 ? "Fournisseur" : "Client"}
                  nameContact={i % 2 === 0 ? "SIDIBE Saydil" : "SONABEL"}
                  date="01/02/26"
                  status={i % 3 === 0 ? "Payée" : "En cours"}
                  note="Facture MASTERPIECE n°001212025. Prestation de service pour la création de l'application TrackFin. Doit être réglé après litige..."
                  mount={160000}
                  restToPay={i % 3 === 0 ? 0 : 80000}
                />
              ))}
            </div>
    </div>
  );
}

export default Dettes;