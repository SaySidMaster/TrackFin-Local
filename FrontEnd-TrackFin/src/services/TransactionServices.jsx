import { apiFetch } from "./api";

export const getTransactions = () => {
  return apiFetch("/transactions");
};

export const createTransaction = (data) => {
  return apiFetch("/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
};