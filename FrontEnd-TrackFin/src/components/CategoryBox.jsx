import clientIcon from "../assets/icons/client.svg";

function CategoryBox({ libelle, type, nbTransactions, onClick }) {

    return (
        <button onClick={onClick} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "14px",
            overflow: "hidden",
            width: "170px",
            height: "150px",
            padding: "20px",
            border: "1.5px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            gap: "6px",
        }}>

            <h3 style={{ textAlign: "center", fontWeight: "700", margin: "0",display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis", }}>
                {libelle}
            </h3>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#374151", margin: "0" }}>
                Type : {type}<br />
                {nbTransactions} Transactions<br />
            </p>

        </button>
    );
}

export default CategoryBox;
