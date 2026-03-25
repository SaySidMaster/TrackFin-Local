import { useNavigate } from "react-router-dom";

function ListActionBanner({ filter }) {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;

    if (value === "journalier") {
      navigate("/statistiques/journalier");
    } else if (value === "mensuel") {
      navigate("/statistiques/mensuel");
    }
  };

  const styleDiv = {
        height: "40px",
        padding: "0 17px",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1E1E",
        borderRadius: "20px",
        border: "none",
        color: "white",
        fontSize: "14px",
        cursor: "pointer",
  };

  const styleSelect = {
        padding: "0 17px",
        height: "40px",
        backgroundColor: "#1E1E1E",
        border: "none",
        color: "white",
        fontSize: "14px",
  };

  return (
    <div style={styleDiv}>
        <select style={styleSelect} onChange={handleChange} value={filter || ""}>
        <option value="journalier">Rapports journaliers</option>
        <option value="mensuel">Rapports mensuels</option>
        </select>
    </div>
  );
}

export default ListActionBanner;