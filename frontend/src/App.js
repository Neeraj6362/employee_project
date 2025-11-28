import React, { useState } from "react";

const API = "http://localhost:5000";

export default function App() {
  const [empId, setEmpId] = useState("");
  const [data, setData] = useState(null);
  const [newEmp, setNewEmp] = useState({
    emp_id: "",
    name: "",
    email: "",
    joining_date: "",
    relieving_date: "",
    role: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const fetchEmp = async () => {
    setErr("");
    setMsg("");
    setData(null); // clear old data before new search
    try {
      const r = await fetch(`${API}/employees/${empId}`);
      const j = await r.json();
      if (!r.ok) {
        setErr(j.message || "Error fetching employee");
      } else {
        setData(j);
      }
    } catch (error) {
      setErr("Backend unreachable");
    }
  };

  const add = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    // Clean payload: remove empty strings
    const payload = Object.fromEntries(
      Object.entries(newEmp).filter(([_, value]) => value !== "")
    );

    try {
      const r = await fetch(`${API}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j.message || "Error adding employee");
      } else {
        setMsg("Employee added successfully");
        // reset form after success
        setNewEmp({
          emp_id: "",
          name: "",
          email: "",
          joining_date: "",
          relieving_date: "",
          role: ""
        });
      }
    } catch (error) {
      setErr("Backend unreachable");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Employee Lookup</h2>
      <input
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
        placeholder="Employee ID"
      />
      <button onClick={fetchEmp} disabled={!empId}>Search</button>
      {err && <p style={{ color: "red" }}>{err}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      <h2>Add Employee</h2>
      <form onSubmit={add} style={{ display: "grid", width: 300, gap: 5 }}>
        {["emp_id", "name", "email", "joining_date", "relieving_date", "role"].map((f) => (
          <input
            key={f}
            type={f.includes("date") ? "date" : "text"}
            placeholder={f}
            value={newEmp[f]}
            onChange={(e) => setNewEmp({ ...newEmp, [f]: e.target.value })}
            required={f !== "relieving_date"} // make relieving_date optional
          />
        ))}
        <button type="submit">Add</button>
      </form>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </div>
  );
}
