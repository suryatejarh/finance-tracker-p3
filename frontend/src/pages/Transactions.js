import { useEffect, useState } from "react";
import { fetchTransactions, createTransaction } from "../api/transactions";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: "expense",
    category: "Food & Dining",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    merchant: "",
  });

  const loadTransactions = async () => {
    try {
      const res = await fetchTransactions();
      setTransactions(res.data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTransaction({
        type: form.type,
        category: form.category,
        amount: Number(form.amount),
        transaction_date: form.date,
        description: form.description,
        merchant: form.merchant || null,
      });

      setForm({
        type: "expense",
        category: "Food & Dining",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        merchant: "",
      });

      loadTransactions();
    } catch {
      alert("Failed to add transaction");
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {/* Add Transaction */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="flex gap-2">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            placeholder="Category"
            className="border p-2 flex-1"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 w-full"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 w-full"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          placeholder="Description"
          className="border p-2 w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Merchant"
          className="border p-2 w-full"
          value={form.merchant}
          onChange={(e) => setForm({ ...form, merchant: e.target.value })}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Transaction
        </button>
      </form>

      {/* Transactions List */}
      <ul className="space-y-2">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="border p-3 flex justify-between rounded"
          >
            <div>
              <p className="font-medium">
                {t.description || t.category}
              </p>
              <p className="text-sm text-gray-500">
                {t.category} • {t.transaction_date}
              </p>
            </div>

            <p
              className={`font-bold ${
                t.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {t.type === "income" ? "+" : "-"}₹{t.amount}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
