
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OwnerFunds({ projectId }: { projectId: string }) {
  const [records, setRecords] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState("Cash");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRecords() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("project_id", projectId)
      .eq("txn_type", "owner_fund")
      .order("txn_date", { ascending: false });

    if (error) setError(error.message);
    else setRecords(data || []);
  }

  useEffect(() => {
    if (projectId) loadRecords();
  }, [projectId]);

  async function addFund(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("transactions").insert({
      project_id: projectId,
      txn_date: date,
      txn_type: "owner_fund",
      party_name: "Project Owner",
      description,
      amount: Number(amount),
      payment_method: method,
      created_by: user?.id
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setAmount("");
    setDescription("");
    await loadRecords();
  }

  const total = records.reduce(
    (sum, record) => sum + Number(record.amount || 0), 0
  );

  return (
    <div className="panel">
      <h2>Owner Funds & Accounts</h2>
      <p className="muted">Record funds received from the project owner.</p>

      <div className="stat" style={{ margin: "20px 0" }}>
        <span>Total Owner Funds Received</span>
        <strong>Rs. {total.toLocaleString("en-PK")}</strong>
      </div>

      <form onSubmit={addFund}>
        <label>Amount (PKR)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <label>Received Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <label>Payment Method</label>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
        >
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>Online</option>
          <option>Cheque</option>
        </select>

        <label>Description</label>
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Payment details"
        />

        {error && <p className="error">{error}</p>}

        <button className="primary" disabled={loading}>
          {loading ? "Saving..." : "Save Owner Funds"}
        </button>
      </form>

      <h3 style={{ marginTop: 28 }}>Transaction History</h3>

      {records.map(record => (
        <div className="project-row" key={record.id}>
          <div className="project-info">
            <b>Rs. {Number(record.amount).toLocaleString("en-PK")}</b>
            <small>
              {record.txn_date} · {record.payment_method || "Not specified"}
            </small>
            <small>{record.description}</small>
          </div>
        </div>
      ))}

      {records.length === 0 && (
        <p className="muted">No owner fund entries yet.</p>
      )}
    </div>
  );
}
