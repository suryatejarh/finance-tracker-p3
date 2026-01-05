import api from "./api";

export const fetchDashboardAnalytics = () =>
  api.get("/analytics/dashboard");
