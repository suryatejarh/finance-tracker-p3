import { useEffect, useState } from "react";
import { fetchCashflowPrediction } from "../api/predictions";

export default function Predictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPrediction = async () => {
      try {
        const res = await fetchCashflowPrediction();
        setData(res.data);
      } catch (err) {
        setError("Failed to load predictions");
      } finally {
        setLoading(false);
      }
    };

    loadPrediction();
  }, []);

  if (loading) {
    return <p className="p-6">Analyzing your financial data…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Cashflow Prediction</h2>

      {/* Prediction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric
          label="Predicted Income"
          value={`₹${data.predicted_income}`}
          color="text-green-600"
        />

        <Metric
          label="Predicted Expenses"
          value={`₹${data.predicted_expenses}`}
          color="text-red-600"
        />

        <Metric
          label="Predicted Balance"
          value={`₹${data.predicted_balance}`}
          highlight
          positive={data.predicted_balance >= 0}
        />
      </div>

      {/* Confidence */}
      <div className="bg-white border rounded p-4">
        <strong>Confidence:</strong>{" "}
        <span
          className={
            data.confidence === "high"
              ? "text-green-600"
              : data.confidence === "medium"
              ? "text-yellow-600"
              : "text-red-600"
          }
        >
          {data.confidence.toUpperCase()}
        </span>
      </div>

      {/* Historical Data */}
      <div className="bg-white border rounded p-4">
        <h3 className="font-semibold mb-3">
          Historical Monthly Summary
        </h3>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Month</th>
              <th className="text-right py-1">Income</th>
              <th className="text-right py-1">Expenses</th>
            </tr>
          </thead>
          <tbody>
            {data.historical_data.map((h, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-1">{h.month}</td>
                <td className="py-1 text-right text-green-600">
                  ₹{Number(h.income).toLocaleString()}
                </td>
                <td className="py-1 text-right text-red-600">
                  ₹{Number(h.expenses).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanation */}
      <div className="bg-gray-50 border rounded p-4 text-sm text-gray-600">
        <p>
          Predictions are generated using your historical monthly
          income and expenses combined with current spending trends.
          No external assumptions are used.
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value, highlight = false, positive = true, color }) {
  return (
    <div className="bg-white border rounded p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${
          highlight
            ? positive
              ? "text-green-700"
              : "text-red-700"
            : color || "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
