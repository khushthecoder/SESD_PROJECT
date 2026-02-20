import { useEffect, useState } from "react";
import { api, ApiError } from "../api";

interface Stats {
  totals: { users: number; patients: number; doctors: number; appointments: number };
  appointmentsByStatus: Record<string, number>;
  revenueToday: number;
  revenue30Days: number;
  topDoctors: Array<{ doctorId: string; name: string; count: number }>;
}

interface UserRow {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  active: boolean;
  createdAt: string;
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ padding: "1rem", background: "#f1f5f9", borderRadius: 8, minWidth: 140 }}>
      <div style={{ fontSize: 12, color: "#475569" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function loadAll() {
    setErr(null);
    try {
      const [s, u] = await Promise.all([
        api.get<Stats>("/admin/stats"),
        api.get<{ items: UserRow[] }>("/admin/users")
      ]);
      setStats(s);
      setUsers(u.items);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "failed to load");
    }
  }
  useEffect(() => { loadAll(); }, []);

  async function toggle(id: string, active: boolean) {
    try {
      await api.patch(`/admin/users/${id}/active`, { active });
      loadAll();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "update failed");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Admin overview</h2>
        {err && <div className="error">{err}</div>}
        {!stats ? <p className="muted">Loading…</p> : (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Tile label="Users" value={stats.totals.users} />
              <Tile label="Patients" value={stats.totals.patients} />
              <Tile label="Doctors" value={stats.totals.doctors} />
              <Tile label="Appointments" value={stats.totals.appointments} />
              <Tile label="Revenue today" value={`₹${stats.revenueToday}`} />
              <Tile label="Revenue 30d" value={`₹${stats.revenue30Days}`} />
            </div>
            <h3 style={{ marginTop: 20 }}>Appointments by status</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {Object.entries(stats.appointmentsByStatus).map(([k, v]) => (
                <Tile key={k} label={k} value={v} />
              ))}
            </div>
            <h3 style={{ marginTop: 20 }}>Top doctors</h3>
            {!stats.topDoctors.length ? <p className="muted">No data yet.</p> : (
              <table>
                <thead><tr><th>Doctor</th><th>Appointments</th></tr></thead>
                <tbody>{stats.topDoctors.map((d) => <tr key={d.doctorId}><td>{d.name}</td><td>{d.count}</td></tr>)}</tbody>
              </table>
            )}
          </>
        )}
      </div>

      <div className="card">
        <h3>Users</h3>
        {!users.length ? <p className="muted">No users.</p> : (
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.firstName} {u.lastName}</td>
                  <td><span className="muted">{u.email}</span></td>
                  <td><span className="pill">{u.role}</span></td>
                  <td>{u.active ? <span className="pill ok">active</span> : <span className="pill err">inactive</span>}</td>
                  <td><button onClick={() => toggle(u.id, !u.active)}>{u.active ? "Deactivate" : "Activate"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
