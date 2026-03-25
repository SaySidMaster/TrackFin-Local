import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import BlockFilter from "../components/BlockFilter";
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

      <div style={{ height: "100vh" }}> {/* 🔥 base */}

        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "white",
            padding: "20px",
            borderRadius: "20px",
          }}
        >

          {/* Zone qui prend le reste */}
          <div style={{ flex: 1, padding: "20px" }}>

            

          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Dettes;