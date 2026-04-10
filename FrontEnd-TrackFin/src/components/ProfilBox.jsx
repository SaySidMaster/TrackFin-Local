import clientIcon from "../assets/icons/client.svg";

function ProfilBox({ id, name, post, email, status, onClick }) {

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "14px",
      overflow: "hidden",
      minWidth: "300px",
      width: "100%",
      padding: "10px",
      border: "1.5px solid #f1f5f9",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      gap: "12px",
      marginBottom: "12px",
    }}>
      <button onClick={onClick} style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}>
        <div style={{
          backgroundColor: "#081226",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 10px",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: "700",
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          lineHeight: "1.4",
        }}>
          <img src={clientIcon} style={{ width: "20px", height: "20px", objectFit: "contain" }} alt="profile" />
        </div>

        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "start", justifyContent: "center", gap: "8px", marginLeft: "12px" }}>
          <h5 style={{ fontWeight: "700", margin: "0" }}>{name}</h5>
        </div>

        <div className="profilBoxEmail" style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "start", justifyContent: "center", gap: "8px", marginLeft: "12px" }}>
          <p style={{ textAlign: "left", fontSize: "13px", color: "#374151", margin: "0" }}>
            Email : {email}
          </p>
        </div>

        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "start", justifyContent: "center", gap: "8px", marginLeft: "12px" }}>
          <p style={{ textAlign: "left", fontSize: "13px", color: "#374151", margin: "0" }}>
            Post : {post} <br />
            Status : <span style={{ color: status === "active" ? "#16a34a" : "#dc2626", fontWeight: "600" }}>{status === "active" ? "Actif" : "Inactif"}</span>
          </p>
        </div>
      </button>
    </div>
  );
}

export default ProfilBox;
