import { apiFetch } from "./api";

export const getDebts = () => {
  return apiFetch("/debts");
};

export const createDebt = (data) => {
  return apiFetch("/debts", {
    method: "POST",
    body: JSON.stringify(data),
  });
};