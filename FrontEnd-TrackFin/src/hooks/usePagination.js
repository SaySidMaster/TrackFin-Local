import { useState, useMemo, useEffect } from "react";

/**
 * usePagination — hook de pagination réutilisable
 *
 * @param {Array}  items     — tableau complet à paginer (ex: filteredTransactions)
 * @param {number} pageSize  — nombre d'éléments par page (défaut: 20)
 *
 * @returns {object}
 *   - page          : page courante (1-based)
 *   - setPage       : setter de page
 *   - pageItems     : slice de `items` pour la page courante
 *   - totalPages    : nombre de pages total
 *   - totalItems    : nombre d'éléments total
 *   - from          : index du premier élément affiché (1-based)
 *   - to            : index du dernier élément affiché (1-based)
 */
export function usePagination(items, pageSize = 20) {
  const [page, setPage] = useState(1);

  // Revenir à la page 1 si le tableau change (filtres changés)
  useEffect(() => {
    setPage(1);
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const from = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, items.length);

  return {
    page,
    setPage,
    pageItems,
    totalPages,
    totalItems: items.length,
    from,
    to,
  };
}