import { useEffect, useState } from "react";
import { api, ApiError } from "../api";

interface ApptItem {
  id: string;
  type: string;
  status: string;
  reason: string | null;
  timeSlot?: { startsAt: string };
  patient?: { user?: { firstName: string; lastName: string } };
}

const NEXT: Record<string, Array<"confirm" | "start" | "complete" | "cancel">> = {
  SCHEDULED: ["confirm", "cancel"],
  CONFIRMED: ["start", "cancel"],
  IN_PROGRESS: ["complete"],
  COMPLETED: [],
  CANCELLED: []
};

export default function DoctorDashboard() {
  const [items, setItems] = useState<ApptItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<{ items: ApptItem[] }>("/appointments/mine");
      setItems(res.items);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "failed to load");
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function act(id: string, action: string) {
    try {
      await api.patch(`/appointments/${id}/status`, { action });
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "action failed");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Today's appointments</h2>
        {loading && <p className="muted">Loading…</p>}
        {err && <div className="error">{err}</div>}
        {!loading && !items.length && <p className="muted">No appointments assigned.</p>}
        {!!items.length && (
          <table>
            <thead><tr><th>When</th><th>Patient</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.timeSlot ? new Date(a.timeSlot.startsAt).toLocaleString() : "—"}</td>
                  <td>{a.patient?.user ? `${a.patient.user.firstName} ${a.patient.user.lastName}` : "—"}</td>
                  <td>{a.type}</td>
                  <td><span className="pill">{a.status}</span></td>
                  <td>
                    {(NEXT[a.status] ?? []).map((action) => (
                      <button key={action} onClick={() => act(a.id, action)} style={{ marginRight: 4 }}>
                        {action}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
