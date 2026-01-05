import { useEffect, useState } from "react";
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from "../api/budgets";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editLimit, setEditLimit] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [form, setForm] = useState({
    category: "Food & Dining",
    limit_amount: "",
  });

  const loadBudgets = async () => {
    try {
      const res = await fetchBudgets();
      setBudgets(res.data);
    } catch {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBudget({
        category: form.category,
        limit_amount: Number(form.limit_amount),
      });

      setForm({ category: "Food & Dining", limit_amount: "" });
      loadBudgets();
    } catch {
      alert("Failed to create budget");
    }
  };
  const startEdit = (b) => {
    setEditingId(b.id);
    setEditLimit(b.limit_amount);
    setEditCategory(b.category);
  };

  const saveEdit = async (id) => {
        try {
            await updateBudget(id, {
            category: editCategory,
            limit_amount: Number(editLimit)
        });
            setEditingId(null);
            loadBudgets();
        } catch {
            alert("Failed to update budget");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditLimit("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this budget?")) return;

        try {
            await deleteBudget(id);
            loadBudgets();
        } catch {
            alert("Failed to delete budget");
        }
};


  if (loading) return <p className="p-6">Loading budgets…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Budgets</h2>

      {/* Add Budget */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          placeholder="Category"
          className="border p-2 flex-1"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Limit"
          className="border p-2 w-32"
          value={form.limit_amount}
          onChange={(e) =>
            setForm({ ...form, limit_amount: e.target.value })
          }
          required
        />

        <button className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </form>

      {/* Budget List */}
      <ul className="space-y-3">
            {budgets.map((b) => {
            const percent =
            b.limit_amount === 0
                ? 0
                : Math.round((b.spent / b.limit_amount) * 100);

            let color = "bg-green-500";
            if (percent > 80) color = "bg-yellow-500";
            if (percent >= 100) color = "bg-red-600";

            return (
            <li key={b.id} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{b.category}</span>

                {editingId === b.id ? (
                    <div className="flex gap-2">
                    <input
                        type="number"
                        value={editLimit}
                        onChange={(e) => setEditLimit(e.target.value)}
                        className="border p-1 w-24"
                    />
                    <button
                        onClick={() => saveEdit(b.id)}
                        className="text-green-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="text-gray-500"
                    >
                        Cancel
                    </button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                    <span>
                        ₹{b.spent} / ₹{b.limit_amount}
                    </span>
                    <button
                        onClick={() => startEdit(b)}
                        className="text-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-600"
                    >
                        Delete
                    </button>
                    </div>
                )}
                {editingId === b.id ? (
                    <input
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="border p-1"
                    />
                    ) : (
                    <span className="font-medium">{b.category}</span>
                )}
                </div>

                <div className="w-full bg-gray-200 rounded h-2">
                <div
                    className={`${color} h-2 rounded`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                />
                </div>

                <p className="text-sm text-gray-500 mt-1">
                {percent}% used
                </p>
            </li>
            );
        })}
        </ul>

    </div>
  );
}
