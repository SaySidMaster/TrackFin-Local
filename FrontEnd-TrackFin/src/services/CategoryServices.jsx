import { apiFetch } from "./api";

export const getCategories = () => {
  return apiFetch("/categories");
};

export const createCategory = async (categoryData) => {
  const data = await apiFetch("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de l'ajout de la catégorie, veuillez réessayer");
  }
  
  return data;
};

export const deleteCategory = async (categoryId) => {
  const data = await apiFetch(`/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!data.success) {
    throw new Error("Erreur lors de la suppression de la catégorie, veuillez réessayer");
  }

  return data;
};

export const updateCategory = async (categoryId, categoryData) => {
  const data = await apiFetch(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de la mise à jour de la catégorie, veuillez réessayer");
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
