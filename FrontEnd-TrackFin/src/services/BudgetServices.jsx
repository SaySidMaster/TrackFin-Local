import { apiFetch } from "./api";

export const getBudgets = () => {
  return apiFetch("/budgets");
};

export const createBudget = async (budgetData) => {
  console.log("Datas:", budgetData);
  const data = await apiFetch("/budgets", {
    method: "POST",
    body: JSON.stringify(budgetData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de l'ajout du budget, veuillez réessayer");
  }
  
  return data;
};

export const deleteBudget = async (budgetId) => {
  const data = await apiFetch(`/budgets/${budgetId}`, {
    method: "DELETE",
  });

  if (!data.success) {
    throw new Error("Erreur lors de la suppression du budget, veuillez réessayer");
  }

  return data;
};

export const updateBudget = async (budgetId, budgetData) => {
  const data = await apiFetch(`/budgets/${budgetId}`, {
    method: "PUT",
    body: JSON.stringify(budgetData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de la mise à jour du budget, veuillez réessayer");
  }
  
  return data;
};
