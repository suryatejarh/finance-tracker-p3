import { useEffect, useState } from "react";
import { fetchDashboardAnalytics } from "../api/analytics";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetchDashboardAnalytics();
        setStats(res.data.monthly_stats);
        setCategories(res.data.category_breakdown);
      } catch {
        setError("Failed to load dashboard analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          value={`₹${stats.total_income || 0}`}
          color="text-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${stats.total_expenses || 0}`}
          color="text-red-600"
        />
        <StatCard
          title="Transactions"
          value={stats.transaction_count || 0}
          color="text-blue-600"
        />
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-3">
          Expense Breakdown (This Month)
        </h3>

        {categories.length === 0 ? (
          <p className="text-gray-500">No expenses this month</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((c) => (
              <li
                key={c.category}
                className="flex justify-between border-b pb-1"
              >
                <span>{c.category}</span>
                <span className="font-semibold">₹{c.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white border rounded p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
