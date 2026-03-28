import { apiFetch } from "./api";
/**
 * LOGIN
 */
export const login = async (email, password) => {
  const data = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // verifie le status de la reponse et le token avant stockage
  if (!data.success) {
    throw new Error("Erreur lors de la connexion");
  }

  // adapte selon ton API Laravel
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

/**
 * SIGNUP (REGISTER)
 */
export const signup = async (userData) => {
  const data = await apiFetch("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (!data.success) {
    throw new Error("Erreur lors de l'inscription");
  }

  // Auto login après inscription (optionnel)
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

/**
 * LOGOUT
 */
export const logout = async () => {
  const data = await apiFetch("/logout", {
    method: "POST",
    body: JSON.stringify({ token: localStorage.getItem("token") }),
  });

  if (!data.success) {
    throw new Error("Erreur lors de la déconnexion");
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return data;
};