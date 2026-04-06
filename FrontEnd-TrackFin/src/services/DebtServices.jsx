import { apiFetch } from "./api";

export const getDebts = () => {
  return apiFetch("/debts");
};

export const createDebt = async (debtData) => {
  const data = await apiFetch("/debts", {
    method: "POST",
    body: JSON.stringify(debtData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de l'ajout de la dette, veuillez réessayer");
  }
  
  return data;
};

export const deleteDebt = async (debtId) => {
  const data = await apiFetch(`/debts/${debtId}`, {
    method: "DELETE",
  });

  if (!data.success) {
    throw new Error("Erreur lors de la suppression de la dette, veuillez réessayer");
  }

  return data;
};

export const updateDebt = async (debtId, debtData) => {
  const data = await apiFetch(`/debts/${debtId}`, {
    method: "PUT",
    body: JSON.stringify(debtData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de la mise à jour de la dette, veuillez réessayer");
  }
  
  return data;
};

export const payDebt = async (debtId, debtData) => {
  const data = await apiFetch(`/debts/${debtId}/pay`, {
    method: "POST",
    body: JSON.stringify(debtData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de l'enregistrement du payement, veuillez réessayer");
  }

  return data;
};
