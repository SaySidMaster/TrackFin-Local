/**
 * Pagination — composant de navigation entre les pages
 *
 * Props :
 *   page        number   — page courante (1-based)
 *   totalPages  number   — nombre de pages total
 *   from        number   — index du premier élément affiché
 *   to          number   — index du dernier élément affiché
 *   totalItems  number   — nombre total d'éléments
 *   onPageChange fn      — (newPage) => void
 */
function Pagination({ page, totalPages, from, to, totalItems, onPageChange }) {
  if (totalPages <= 1) return null;

  // Génère les numéros de pages à afficher (avec "..." si besoin)
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    // Toujours afficher la première
    pages.push(1);
    if (page > 3) pages.push("...");
    // Pages autour de la page courante
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(p);
    }
    if (page < totalPages - 2) pages.push("...");
    // Toujours afficher la dernière
    pages.push(totalPages);
    return pages;
  };

  const btnBase = {
    height: "34px",
    minWidth: "34px",
    padding: "0 10px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, border-color 0.15s",
    fontWeight: "500",
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 4px 4px",
      flexWrap: "wrap",
      gap: 8,
    }}>
      {/* Compteur */}
      <span style={{ fontSize: 13, color: "#6b7280" }}>
        {from}–{to} sur <strong style={{ color: "#0f172a" }}>{totalItems}</strong>
      </span>

      {/* Boutons de navigation */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {/* Précédent */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={{
            ...btnBase,
            backgroundColor: page === 1 ? "#f8fafc" : "white",
            color: page === 1 ? "#cbd5e1" : "#0f172a",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          ←
        </button>

        {/* Numéros */}
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} style={{ color: "#94a3b8", padding: "0 4px", fontSize: 13 }}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                ...btnBase,
                backgroundColor: p === page ? "#081226" : "white",
                color: p === page ? "white" : "#0f172a",
                borderColor: p === page ? "#081226" : "#e2e8f0",
                fontWeight: p === page ? "700" : "500",
              }}
            >
              {p}
            </button>
          )
        )}

        {/* Suivant */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={{
            ...btnBase,
            backgroundColor: page === totalPages ? "#f8fafc" : "white",
            color: page === totalPages ? "#cbd5e1" : "#0f172a",
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default Pagination;