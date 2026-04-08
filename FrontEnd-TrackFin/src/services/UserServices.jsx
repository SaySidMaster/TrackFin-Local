import { apiFetch } from "./api";

export const getUsers = () => {
  return apiFetch("/users");
};

export const createUser = async (userData) => {
  const data = await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  if (!data.success) {
    throw new Error("Erreur lors de l'ajout du profil, veuillez réessayer");
  }
  return data;
};

export const updateUser = async (userId, userData) => {
  const data = await apiFetch(`/user/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de la mise à jour du profil, veuillez réessayer");
  }

  return data;
};

export const deleteUser = async (userId) => {
  const data = await apiFetch(`/user/${userId}`, {
    method: "DELETE",
  });

  if (!data.success) {
    throw new Error("Erreur lors de la suppression du profil, veuillez réessayer");
  }

  return data;
};