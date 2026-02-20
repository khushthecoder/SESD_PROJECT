import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import { Link } from "react-router-dom";

interface ApptItem {
  id: string;
  type: string;
  status: string;
  reason: string | null;
  fee: string | number;
  timeSlot?: { startsAt: string; endsAt: string };
  doctor?: { user?: { firstName: string; lastName: string }; specialization: string };
}

function statusPill(s: string) {
  const cls = s === "COMPLETED" ? "ok" : s === "CANCELLED" ? "err" : s === "IN_PROGRESS" ? "warn" : "";
  return <span className={`pill ${cls}`}>{s}</span>;
}

export default function PatientDashboard() {
  const [items, setItems] = useState<ApptItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.get<{ items: ApptItem[] }>("/appointments/mine");
      setItems(res.items);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function cancel(id: string) {
    try {
      await api.patch(`/appointments/${id}/status`, { action: "cancel" });
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "cancel failed");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My appointments</h2>
        <p className="muted">Book, view, and cancel your appointments.</p>
        <Link to="/book"><button className="primary">Book appointment</button></Link>
      </div>

      <div className="card">
        <h3>Upcoming & past</h3>
        {loading && <p className="muted">Loading…</p>}
        {err && <div className="error">{err}</div>}
        {!loading && !items.length && <p className="muted">No appointments yet.</p>}
        {!!items.length && (
          <table>
            <thead>
              <tr><th>When</th><th>Doctor</th><th>Type</th><th>Status</th><th>Fee</th><th /></tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.timeSlot ? new Date(a.timeSlot.startsAt).toLocaleString() : "—"}</td>
                  <td>{a.doctor?.user ? `${a.doctor.user.firstName} ${a.doctor.user.lastName}` : "—"}<br/><span className="muted">{a.doctor?.specialization}</span></td>
                  <td>{a.type}</td>
                  <td>{statusPill(a.status)}</td>
                  <td>{String(a.fee)}</td>
                  <td>{["SCHEDULED", "CONFIRMED"].includes(a.status) && (
                    <button onClick={() => cancel(a.id)}>Cancel</button>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
