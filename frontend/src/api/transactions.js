import api from "./api";

export const fetchTransactions = (params = {}) =>
  api.get("/transactions", { params });

export const createTransaction = (data) =>
  api.post("/transactions", data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`);

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data);