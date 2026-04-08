import clientIcon from "../assets/icons/client.svg";

function CategoryBox({ libelle, type, onClick }) {

    return (
        <button onClick={onClick} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            backgroundColor: "white",
            borderRadius: "14px",
            padding: "10px 20px",
            height: "50px",
            width: "auto",
            border: "1.5px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            gap: "-6px",
        }}>

            <h4 style={{ margin: "0", textAlign: "center", fontWeight: "600", whiteSpace: "nowrap" }}>
                {libelle}
            </h4>
            <p style={{ textAlign: "left", fontSize: "10px", color: "#374151", margin: "0" }}>
                {type}
            </p>

        </button>
    );
}

export default CategoryBox;
