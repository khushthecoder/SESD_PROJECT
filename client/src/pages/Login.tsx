import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setTokens, ApiError } from "../api";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string; firstName: string; lastName: string };
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      setTokens(res.accessToken, res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      nav("/");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2>Sign in</h2>
        <form onSubmit={submit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <div style={{ height: 8 }} />
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          {err && <div className="error">{err}</div>}
          <div style={{ height: 12 }} />
          <button className="primary" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
