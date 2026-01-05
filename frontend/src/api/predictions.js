import api from "./api";

export const fetchCashflowPrediction = () =>
  api.get("/predictions/cashflow");
