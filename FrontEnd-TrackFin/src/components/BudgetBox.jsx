function BudgetBox({ id, category, date, amountLimit, spentAmount, onClick }) {

    const amountLeft = amountLimit - spentAmount;
    //cas du status avec switchcase
    const statusLabel = (() => {
        switch (true) {
            case amountLeft == 0:
                return "Equilibré";
            case amountLeft < 0:
                return "Limite dépassée";
                break;
            case amountLeft > 0 && amountLeft <= amountLimit:
                return "Limite pas atteinte";
                break;
            default:
                return "Equilibré";
        }
    })();

    // Couleur du badge de statut
    const statusColor = (() => {
        switch (true) {
            case amountLeft == 0:
                return { backgroundColor: "#00000042" };
            case amountLeft < 0:
                return { backgroundColor: "#ff000041" };
                break;
            case amountLeft > 0 && amountLeft <= amountLimit:
                return { backgroundColor: "#16c0604f" };
                break;
            default:
                return { backgroundColor: "#00000042" };
        }
    })();
    return (
        <button className="budgetBox" onClick={onClick} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            backgroundColor: "white",
            borderRadius: "14px",
            overflow: "hidden",
            minWidth: "280px",
            width: "calc(50% - 6px)",
            padding: "20px",
            border: "1.5px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            gap: "12px",
        }}>

            {/* Ligne 1 : type + badge statut */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <h3 style={{ fontWeight: "700", margin: "0", textAlign: "left" }}>
                    {category}<br />
                    <span style={{ fontWeight: "400" }}>{date}</span>
                </h3>
                <p style={{ ...statusColor, borderRadius: "6px", padding: "3px 12px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                    {statusLabel}
                </p>
            </div>

            {/* Ligne 2 : Montant */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ fontSize: "15px", color: "#374151" }}>Limite : </span>
                <span style={{ fontSize: "15px", color: "#374151" }}>{amountLimit}</span>
            </div>

            {/* Ligne 3 : Montant restant */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ fontSize: "15px", color: "#374151" }}>Restant : </span>
                <span style={{ fontSize: "15px", color: "#374151" }}>{amountLeft}</span>
            </div>

        </button>
    );
}

export default BudgetBox;
