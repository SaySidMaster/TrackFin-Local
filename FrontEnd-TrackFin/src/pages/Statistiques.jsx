import Banner from "../components/Banner";
import CallToAction1 from "../components/CallToAction1";
import ListActionBanner from "../components/ListActionBanner";
import exportIcon from "../assets/icons/exporter.svg";
import statisticIcon from "../assets/icons/statistics_2.svg";
import { useDialog } from "../context/DialogContext";
import BlockFilter from "../components/BlockFilter";
import { useState } from "react";

function Statistiques({ filter }) {

  const filterValue = () => {
    if (filter === "journalier") {
      return "date";
    } else {
      return "month";
    };
  }

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setPMin] = useState("");
  const [maxPrice, setPMax] = useState("");
  const [fromDate, setDFrom] = useState("");
  const [toDate, setDTo] = useState("");
  

  const { openDialog } = useDialog();

  const handleExportDialog = async (e) => {
    openDialog({
      title: "Ajouter un budget",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "amount", type: "number", label: "Montant", required: true },
      ],
      onSubmit: (values) => console.log("Nouveau budget:", values),
    });
  };

  const handleGraphDialog = async (e) => {
    openDialog({
      title: "Détails du budget",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "amount", type: "number", label: "Montant", required: true },
      ],
      onSubmit: (values) => console.log("Détails du budget:", values),
    });
  };

  return (
    <div className="pageBloc">
      <Banner title="Statistiques" actionBanner={<ListActionBanner filter={filter} />} actionBanner2={<CallToAction1 title="Graphique" iconSrc={statisticIcon} action={handleGraphDialog} />}  callToAction={<CallToAction1 title="Exporter" iconSrc={exportIcon} action={handleExportDialog} />} />



      <BlockFilter
        selects={[
          { value: type, onChange: e => setType(e.target.value), placeholder: "Filtrer par solde", options: [] },
        ]}
        amounts={{
          min: { value: minPrice, onChange: e => setPMin(e.target.value), placeholder: "Solde Min" },
          max: { value: maxPrice, onChange: e => setPMax(e.target.value), placeholder: "Solde Max" }
        }}
        dates={{
          from: { value: fromDate, mode: filterValue(), onChange: e => setDFrom(e.target.value) },
          to: { value: toDate, mode: filterValue(), onChange: e => setDTo(e.target.value) }
        }}
      />

      {/* Contenu de la page Statistiques */}

      <div style={{ height: "70vh" }}> {/* 🔥 base */}

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

            <table style={{ width: "100%", height: "100%", borderCollapse: "collapse" }}>

              {/* THEAD */}
              <thead>
                <tr
                  style={{
                    display: "table",
                    width: "100%",
                    tableLayout: "fixed",
                    height: "50px",
                    color: "#0000007c",
                    fontWeight: "500",
                    borderTop: "1px solid #b8b4b483",
                    borderBottom: "1px solid #b8b4b471",
                  }}
                >
                  <th style={{ textAlign: "left", width: "100px" }}>Période</th>
                  <th style={{ textAlign: "left", width: "120px" }}>Revenues</th>
                  <th style={{ textAlign: "left", width: "120px" }}>Dépenses</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Solde<br />théorique</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Dettes<br />à payer</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Créances<br />à recevoir</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Buget<br />total</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Ecart</th>
                </tr>
              </thead>

              {/* TBODY SCROLL */}
              <tbody
                style={{
                  display: "block",
                  height: "100%",
                  overflowY: "auto",
                }}
              >
                {[...Array(28)].map((_, i) => (
                  <tr
                    key={i}
                    style={{
                      display: "table",
                      width: "100%",
                      tableLayout: "fixed",
                      height: "50px",
                    }}
                  >
                    <td style={{ textAlign: "left", width: "100px" }}>{filter === "mensuel" ? "Janvier 2023" : "1/01/2023"}</td>
                    <td style={{ textAlign: "left", width: "120px" }}>200.000</td>
                    <td style={{ textAlign: "left", width: "120px" }}>65.000</td>
                    <td style={{ textAlign: "right", width: "120px" }}>575.000</td>
                    <td style={{ textAlign: "right", width: "120px" }}>25.000</td>
                    <td style={{ textAlign: "right", width: "120px" }}>100.000</td>
                    <td style={{ textAlign: "right", width: "120px" }}>60.000</td>
                    <td style={{ textAlign: "right", width: "120px" }}>+5000</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistiques;