import clientIcon from "../assets/icons/client.svg";

function ProfilBox({ id, name, post, username, status, onClick }) {

    return (
        <button onClick={onClick} style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "14px",
            overflow: "hidden",
            minWidth: "300px",
            width: "100%",
            padding: "20px",
            border: "1.5px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            gap: "12px",
            marginBottom: "12px",
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
                width: "80px",
                height: "80px",
                borderRadius: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                lineHeight: "1.4",
            }}>
                <img src={clientIcon} style={{ width: "40px", height: "40px", objectFit: "contain" }} alt="profile" />
            </div>

            <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "start", justifyContent: "center", gap: "12px" }}>
                <h3 style={{ fontWeight: "700", margin: "0" }}>
                    {name}
                </h3>
                <p style={{ textAlign: "left", fontSize: "13px", color: "#374151", margin: "0" }}>
                    Username : {username} <br />
                    Post : {post} <br />
                </p>
            </div>
            <div style={{backgroundColor: status === "active" ? "#16C060" : "#4D4D4D", display: "flex", justifyContent: status === "active" ? "end" : "start", alignItems: "center", borderRadius: "15px", height: "30px", width: "60px"}}>
                <div style={{ width:"30px", height: "30px", borderRadius: "15px", backgroundColor: "#D9D9D9" }}></div>
            </div>

        </button>
    );
}

export default ProfilBox;
