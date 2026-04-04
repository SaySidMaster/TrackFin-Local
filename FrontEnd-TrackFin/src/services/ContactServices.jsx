import { apiFetch } from "./api";

export const getContacts = () => {
  return apiFetch("/contacts");
};

export const createContact = (data) => {
  return apiFetch("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
};