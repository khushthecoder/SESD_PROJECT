import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setTokens, ApiError } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "PATIENT"
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  function on<K extends keyof typeof form>(k: K, v: string) {
    setForm({ ...form, [k]: v });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await api.post<{ accessToken: string; refreshToken: string; user: any }>(
        "/auth/register",
        form
      );
      setTokens(res.accessToken, res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      nav("/");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card">
        <h2>Register</h2>
        <form onSubmit={submit}>
          <div className="row">
            <div><label>First name</label><input value={form.firstName} onChange={(e) => on("firstName", e.target.value)} required /></div>
            <div><label>Last name</label><input value={form.lastName} onChange={(e) => on("lastName", e.target.value)} required /></div>
          </div>
          <div style={{ height: 8 }} />
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => on("email", e.target.value)} required />
          <div style={{ height: 8 }} />
          <label>Password (min 8)</label>
          <input type="password" value={form.password} onChange={(e) => on("password", e.target.value)} required minLength={8} />
          <div style={{ height: 8 }} />
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => on("phone", e.target.value)} />
          <div style={{ height: 8 }} />
          <label>Role</label>
          <select value={form.role} onChange={(e) => on("role", e.target.value)}>
            <option value="PATIENT">Patient</option>
            <option value="RECEPTIONIST">Receptionist</option>
          </select>
          {err && <div className="error">{err}</div>}
          <div style={{ height: 12 }} />
          <button className="primary" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
        </form>
      </div>
    </div>
  );
}
