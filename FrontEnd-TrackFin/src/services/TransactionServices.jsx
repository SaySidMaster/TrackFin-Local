import { apiFetch } from "./api";

export const getTransactions = () => {
  return apiFetch("/transactions");
};

export const createTransaction = async (transactionData) => {
  console.log("Datas:", transactionData);
  const data = await apiFetch("/transactions", {
    method: "POST",
    body: JSON.stringify(transactionData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de l'ajout de la transaction, veuillez réessayer");
  }
  
  return data;
};

export const deleteTransaction = async (transactionId) => {
  const data = await apiFetch(`/transactions/${transactionId}`, {
    method: "DELETE",
  });

  if (!data.success) {
    throw new Error("Erreur lors de la suppression de la transaction, veuillez réessayer");
  }

  return data;
};

export const updateTransaction = async (transactionId, transactionData) => {
  const data = await apiFetch(`/transactions/${transactionId}`, {
    method: "PUT",
    body: JSON.stringify(transactionData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de la mise à jour de la transaction, veuillez réessayer");
  }
  
  return data;
};
