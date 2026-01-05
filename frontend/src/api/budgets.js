import api from "./api";

export const fetchBudgets = () => api.get("/budgets");

export const createBudget = (data) =>
  api.post("/budgets", data);
