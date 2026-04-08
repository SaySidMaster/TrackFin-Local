import { apiFetch } from "./api";

export const getContacts = () => {
  return apiFetch("/contacts");
};

export const createContact = async (contactData) => {
  const data = await apiFetch("/contacts", {
    method: "POST",
    body: JSON.stringify(contactData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de l'ajout du contact, veuillez réessayer");
  }

  return data;
};

export const deleteContact = async (contactId) => {
  const data = await apiFetch(`/contacts/${contactId}`, {
    method: "DELETE",
  });

  if (!data.success) {
    throw new Error("Erreur lors de la suppression du contact, veuillez réessayer");
  }

  return data;
};

export const updateContact = async (contactId, contactData) => {
  const data = await apiFetch(`/contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify(contactData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de la mise à jour du contact, veuillez réessayer");
  }

  return data;
};
