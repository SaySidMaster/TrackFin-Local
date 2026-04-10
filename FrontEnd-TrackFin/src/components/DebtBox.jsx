import detailsIcon from "../assets/icons/details.svg";

function DebtBox({ id, type, typeContact, nameContact, date, status, note, mount, restToPay, onClick, onPay }) {
    const currency = import.meta.env.VITE_CURRENCY;

    // Couleur du badge de statut
    const statusColor = status === "Payée"
        ? { backgroundColor: "#dcfce7", color: "#16a34a" }
        : { backgroundColor: "#fecdd3", color: "#e11d48" };

    return (
        <div className="debtBox" style={{
            display: "flex",
            padding: "0",
            alignItems: "stretch",
            backgroundColor: "white",
            borderRadius: "14px",
            overflow: "hidden",
            minHeight: "90px",
            border: "1.5px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>

            {/* ── 1. Bloc type (A payer / A recevoir) ───────── */}
            <div className="debtType" style={{
                backgroundColor: "#081226",
                color: "white",
                minWidth: "90px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 10px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "700",
                width: "130px",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                lineHeight: "1.4",
            }}>
                {type}
            </div>

            {/* ── 2. Contact + date ─────────────────────────── */}
            <div className="debtContact" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "6px",
                padding: "12px 16px",
                width: "300px",
                borderRight: "1px solid #e2e8f0",
            }}>
                {/* Ligne 1 : type contact + badge statut */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <span style={{ fontWeight: "700", fontSize: "13px" }}>{typeContact} :</span>
                    <span style={{
                        ...statusColor,
                        borderRadius: "6px",
                        padding: "3px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                    }}>
                        {status}
                    </span>
                </div>
                {/* Ligne 2 : nom + date */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#374151" }}>{nameContact}</span>
                    <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>Pour le : {date}</span>
                </div>
            </div>

            {/* ── 3. Note ───────────────────────────────────── */}
            <div className="debtNote" style={{
                flex: 1,
                padding: "12px 16px",
                fontSize: "13px",
                color: "#6b7280",
                lineHeight: "1.5",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}>
                <span style={{ fontWeight: "500", color: "#374151", marginBottom: "2px" }}>Note :</span>
                <span style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                    {note}
                </span>
            </div>

            {/* ── 4. Montant ────────────────────────────────── */}
            <div className="debtAmount" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "12px 20px",
                borderLeft: "1px solid #e2e8f0",
                minWidth: "150px",
                gap: "4px",
            }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280" }}>
                    Montant ({currency}) <br />
                    <span style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>
                        {Number(mount).toLocaleString("fr-FR")}
                    </span>
                </span>

                {(restToPay !== undefined || restToPay === 0) && (
                    <span style={{ fontSize: "15px", color: "#0f172a" }}>
                        Reste : {Number(restToPay).toLocaleString("fr-FR")}
                    </span>
                )}
            </div>



            {/* ── 5. Bouton d'action ────────────────────────────────── */}
            <div className="debtButton" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "12px 16px",
                minWidth: "140px",
                gap: "8px",
            }}>
                {restToPay != 0 ?
                    <button onClick={onPay}
                        style={{
                            width: "100%",
                            height: "44px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#16a34a",
                            color: "white",
                            fontWeight: "700",
                            fontSize: "13px",
                            letterSpacing: "0.5px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        PAYER
                    </button>
                    : <div style={{ width: "100%" }}></div>}
                <button onClick={onClick}
                    style={{
                        width: "44px",
                        height: "44px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "white",
                    }}
                >
                    <img src={detailsIcon} alt="details" />
                </button>

            </div>

        </div>
    );
}

export default DebtBox;
