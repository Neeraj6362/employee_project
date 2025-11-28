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
    try {
      let r = await fetch(API + "/employees/" + empId);
      let j = await r.json();
      if (!r.ok) setErr(j.message);
      else setData(j);
    } catch {
      setErr("Backend unreachable");
    }
  };

  const add = async e => {
    e.preventDefault();
    setErr("");
    setMsg("");

    // Clean payload: remove empty strings
    const payload = {};
    for (const [key, value] of Object.entries(newEmp)) {
      if (value !== "") {
        payload[key] = value;
      }
    }

    try {
      let r = await fetch(API + "/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      let j = await r.json();
      if (!r.ok) setErr(j.message);
      else setMsg("Employee added");
    } catch {
      setErr("Backend unreachable");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Employee Lookup</h2>
      <input
        value={empId}
        onChange={e => setEmpId(e.target.value)}
        placeholder="Employee ID"
      />
      <button onClick={fetchEmp}>Search</button>
      {err && <p style={{ color: "red" }}>{err}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      <h2>Add Employee</h2>
      <form onSubmit={add} style={{ display: "grid", width: 300, gap: 5 }}>
        {["emp_id", "name", "email", "joining_date", "relieving_date", "role"].map(f => (
          <input
            key={f}
            type={f.includes("date") ? "date" : "text"}
            placeholder={f}
            value={newEmp[f]}
            onChange={e => setNewEmp({ ...newEmp, [f]: e.target.value })}
          />
        ))}
        <button>Add</button>
      </form>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </div>
  );
}
