import clientIcon from "../assets/icons/client.svg";
import supplierIcon from "../assets/icons/supplier.svg";

function ContactBox({ id, type, name, number, email }) {

    return (
        <button style={{
            display: "flex",
            alignItems: "stretch",
            backgroundColor: "white",
            borderRadius: "14px",
            overflow: "hidden",
            minWidth: "300px",
            width: "calc(50% - 6px)",
            padding: "20px",
            border: "1.5px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            gap: "12px",
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
                <img src={type === "Client" ? clientIcon : supplierIcon} style={{ width: "40px", height: "40px", objectFit: "contain" }} alt={type} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", gap: "12px" }}>
                <h3 style={{ fontWeight: "700", margin: "0" }}>
                    {type} : <span style={{ fontWeight: "400" }}>{name}</span>
                </h3>
                <p style={{ textAlign: "left", fontSize: "13px", color: "#374151", margin: "0" }}>
                    Téléphone : {number} <br />
                    Email : {email}
                </p>
            </div>

        </button>
    );
}

export default ContactBox;
