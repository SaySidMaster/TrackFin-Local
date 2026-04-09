import { apiFetch } from "./api";

export const getDashboard = () => apiFetch("/dashboard");