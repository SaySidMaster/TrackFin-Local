import searchIcon from "../assets/icons/search.svg";
 
// ── Styles partagés ───────────────────────────────────────────────
const inputStyle = {
  height: "40px",
  padding: "0 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13px",
  fontFamily: "inherit",
  color: "#0f172a",
  backgroundColor: "white",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "text",
};
 
const selectStyle = {
  ...inputStyle,
  paddingRight: "32px",
  cursor: "pointer",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};
 
// ── Composant principal ───────────────────────────────────────────
function BlockFilter({ search, selects, amounts, dates }) {
 
  // La 1re ligne contient la recherche + les selects
  const hasRow1 = search || (selects && selects.length > 0);
 
  // La 2e ligne contient les montants et/ou les dates
  const hasAmounts = amounts && (amounts.min || amounts.max);
  const hasDates   = dates   && (dates.from || dates.to);
  const hasRow2    = hasAmounts || hasDates;
 
  // Si aucune prop n'est fournie, on n'affiche rien
  if (!hasRow1 && !hasRow2) return null;
 
  return (
    <form className="BlockFilter" style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      width: "100%",
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "16px 20px",
    }}>
 
      {/* ── Ligne 1 : Recherche + Selects ────────────────────── */}
      
      {hasRow1 && (
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", alignContent: "flex-start", }}> 
          {/* Barre de recherche — affichée uniquement si search est fourni */}
          {search && (
            <div style={{ position: "relative", flex: 2, minWidth: "200px" }}>
              <input
                type="text"
                value={search.value}
                onChange={search.onChange}
                placeholder={search.placeholder ?? "Rechercher..."}
                style={{ ...inputStyle, width: "100%", padding: "0px 10px" }}
              />
            </div>
          )}
 
          {/* Listes déroulantes — affichées uniquement si selects est fourni */}
          {selects && selects.map((sel, i) => (
            <div key={i} style={{ position: "relative", minWidth: "150px" }}>
              <select
                value={sel.value}
                onChange={sel.onChange}
                style={{ ...selectStyle, width: "100%" }}
              >
                <option value="">{sel.placeholder ?? "Sélectionner"}</option>
                {sel.options && sel.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
 
      {/* ── Ligne 2 : Montants + Dates ───────────────────────── */}
      {hasRow2 && (
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", alignContent: "flex-start", }}>
 
          {/* Montant min — affiché uniquement si amounts.min est fourni */}
          {amounts?.min && (
            <input
              type="number"
              value={amounts.min.value}
              onChange={amounts.min.onChange}
              placeholder={amounts.min.placeholder ?? "Montant min :"}
              style={{ ...inputStyle, minWidth: "130px", flex: 1 }}
            />
          )}
 
          {/* Montant max — affiché uniquement si amounts.max est fourni */}
          {amounts?.max && (
            <input
              type="number"
              value={amounts.max.value}
              onChange={amounts.max.onChange}
              placeholder={amounts.max.placeholder ?? "Montant max :"}
              style={{ ...inputStyle, minWidth: "130px", flex: 1 }}
            />
          )}
 
          {/* Date début — affichée uniquement si dates.from est fourni */}
          {dates?.from && (
            <input
              type={dates.from.mode === "month" ? "month" : "date"}
              value={dates.from.value}
              onChange={dates.from.onChange}
              placeholder={dates.from.placeholder ?? "Date début : --/--/----"}
              style={{ ...inputStyle, minWidth: "160px", flex: 1 }}
            />
          )}
 
          {/* Date fin — affichée uniquement si dates.to est fourni */}
          {dates?.to && (
            <input
              type={dates.to.mode === "month" ? "month" : "date"}
              value={dates.to.value}
              onChange={dates.to.onChange}
              placeholder={dates.to.placeholder ?? "Date fin : --/--/----"}
              style={{ ...inputStyle, minWidth: "160px", flex: 1 }}
            />
          )}
        </div>
      )}
    </form>
  );
}
 
export default BlockFilter;