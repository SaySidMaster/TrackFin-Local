import { apiFetch } from "./api";

export const getPaymentMethods = () => {
  return apiFetch("/payment-methods");
};

export const createPaymentMethod = async (paymentMethodData) => {
  const data = await apiFetch("/payment-methods", {
    method: "POST",
    body: JSON.stringify(paymentMethodData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de l'ajout de la méthode de paiement, veuillez réessayer");
  }
  
  return data;
};

export const deletePaymentMethod = async (paymentMethodId) => {
  const data = await apiFetch(`/payment-methods/${paymentMethodId}`, {
    method: "DELETE",
  });

  if (!data.success) {
    throw new Error("Erreur lors de la suppression de la méthode de paiement, veuillez réessayer");
  }

  return data;
};

export const updatePaymentMethod = async (paymentMethodId, paymentMethodData) => {
  const data = await apiFetch(`/payment-methods/${paymentMethodId}`, {
    method: "PUT",
    body: JSON.stringify(paymentMethodData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de la mise à jour de la méthode de paiement  , veuillez réessayer");
  }
  
  return data;
};
