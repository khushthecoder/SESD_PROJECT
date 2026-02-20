import { useEffect, useState } from "react";
import { api, ApiError } from "../api";

interface Appt {
  id: string;
  type: string;
  status: string;
  reason: string | null;
  fee: string | number;
  timeSlot?: { startsAt: string };
  patient?: { user?: { firstName: string; lastName: string; email: string } };
  doctor?: { user?: { firstName: string; lastName: string }; specialization: string };
}

interface Patient {
  id: string;
  userId: string;
  user?: { firstName: string; lastName: string; email: string; phone: string | null };
}

interface Doctor {
  id: string;
  specialization: string;
  consultationFee: string | number;
  user?: { firstName: string; lastName: string };
}

interface Slot { id: string; startsAt: string; }

const NEXT: Record<string, Array<"confirm" | "start" | "complete" | "cancel">> = {
  SCHEDULED: ["confirm", "cancel"],
  CONFIRMED: ["start", "cancel"],
  IN_PROGRESS: ["complete"],
  COMPLETED: [],
  CANCELLED: []
};

function pill(s: string) {
  const cls = s === "COMPLETED" ? "ok" : s === "CANCELLED" ? "err" : s === "IN_PROGRESS" ? "warn" : "";
  return <span className={`pill ${cls}`}>{s}</span>;
}

export default function ReceptionistDashboard() {
  const [tab, setTab] = useState<"appointments" | "register" | "book">("appointments");
  return (
    <div className="container">
      <div className="card">
        <h2>Reception desk</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className={tab === "appointments" ? "primary" : ""} onClick={() => setTab("appointments")}>All appointments</button>
          <button className={tab === "register" ? "primary" : ""} onClick={() => setTab("register")}>Register patient</button>
          <button className={tab === "book" ? "primary" : ""} onClick={() => setTab("book")}>Book on behalf</button>
        </div>
      </div>
      {tab === "appointments" && <Appointments />}
      {tab === "register" && <RegisterPatient />}
      {tab === "book" && <BookOnBehalf />}
    </div>
  );
}

function Appointments() {
  const [items, setItems] = useState<Appt[]>([]);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const qs = status ? `?status=${status}` : "";
      const r = await api.get<{ items: Appt[] }>(`/appointments${qs}`);
      setItems(r.items);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "failed to load");
    }
  }
  useEffect(() => { load(); }, [status]);

  async function act(id: string, action: string) {
    try {
      await api.patch(`/appointments/${id}/status`, { action });
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "action failed");
    }
  }

  return (
    <div className="card">
      <div className="row" style={{ alignItems: "end" }}>
        <div style={{ maxWidth: 240 }}>
          <label>Filter status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      {err && <div className="error">{err}</div>}
      {!items.length ? (
        <p className="muted" style={{ marginTop: 12 }}>No appointments found.</p>
      ) : (
        <table style={{ marginTop: 12 }}>
          <thead><tr><th>When</th><th>Patient</th><th>Doctor</th><th>Type</th><th>Status</th><th>Fee</th><th /></tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.timeSlot ? new Date(a.timeSlot.startsAt).toLocaleString() : "—"}</td>
                <td>{a.patient?.user ? `${a.patient.user.firstName} ${a.patient.user.lastName}` : "—"}<br/><span className="muted">{a.patient?.user?.email}</span></td>
                <td>{a.doctor?.user ? `${a.doctor.user.firstName} ${a.doctor.user.lastName}` : "—"}<br/><span className="muted">{a.doctor?.specialization}</span></td>
                <td>{a.type}</td>
                <td>{pill(a.status)}</td>
                <td>{String(a.fee)}</td>
                <td>
                  {(NEXT[a.status] ?? []).map((action) => (
                    <button key={action} onClick={() => act(a.id, action)} style={{ marginRight: 4 }}>{action}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function RegisterPatient() {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", phone: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null); setBusy(true);
    try {
      await api.post("/auth/register", { ...form, role: "PATIENT" });
      setMsg(`Patient "${form.firstName} ${form.lastName}" registered.`);
      setForm({ email: "", password: "", firstName: "", lastName: "", phone: "" });
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "failed");
    } finally { setBusy(false); }
  }

  return (
    <div className="card">
      <h3>Register new patient (walk-in)</h3>
      <form onSubmit={submit}>
        <div className="row">
          <div><label>First name</label><input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /></div>
          <div><label>Last name</label><input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /></div>
        </div>
        <div style={{ height: 8 }} />
        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <div style={{ height: 8 }} />
        <label>Temporary password (min 8)</label>
        <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        <div style={{ height: 8 }} />
        <label>Phone</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {err && <div className="error">{err}</div>}
        {msg && <div style={{ color: "#166534", marginTop: 8 }}>{msg}</div>}
        <div style={{ height: 12 }} />
        <button className="primary" disabled={busy}>{busy ? "Registering…" : "Register patient"}</button>
      </form>
    </div>
  );
}

function BookOnBehalf() {
  const [q, setQ] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState("");
  const [type, setType] = useState("CONSULTATION");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<{ items: Doctor[] }>("/doctors").then((r) => setDoctors(r.items)).catch(() => {});
  }, []);

  async function search() {
    try {
      const r = await api.get<{ items: Patient[] }>(`/patients?q=${encodeURIComponent(q)}`);
      setPatients(r.items);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "search failed");
    }
  }

  useEffect(() => {
    if (!doctorId || !date) return;
    api.get<{ slots: Slot[] }>(`/doctors/${doctorId}/slots?date=${date}`)
      .then((r) => { setSlots(r.slots); setSlotId(""); })
      .catch((e) => setErr(e instanceof ApiError ? e.message : "slots failed"));
  }, [doctorId, date]);

  async function book() {
    if (!patient || !doctorId || !slotId) { setErr("select patient, doctor, slot"); return; }
    setErr(null); setOk(null); setBusy(true);
    try {
      await api.post("/appointments/for-patient", {
        patientUserId: patient.userId,
        doctorId, timeSlotId: slotId, type, reason: reason || undefined
      });
      setOk("Appointment booked.");
      setPatient(null); setQ(""); setPatients([]); setSlotId(""); setReason("");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "booking failed");
    } finally { setBusy(false); }
  }

  return (
    <>
      <div className="card">
        <h3>1. Find patient</h3>
        <div className="row">
          <input placeholder="search by email…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={search}>Search</button>
        </div>
        {patients.length > 0 && !patient && (
          <table style={{ marginTop: 12 }}>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.user ? `${p.user.firstName} ${p.user.lastName}` : p.id}</td>
                  <td><span className="muted">{p.user?.email}</span></td>
                  <td><button onClick={() => setPatient(p)}>Select</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {patient && <p style={{ marginTop: 8 }}>Patient: <strong>{patient.user?.firstName} {patient.user?.lastName}</strong> <span className="muted">({patient.user?.email})</span> <button onClick={() => setPatient(null)}>change</button></p>}
      </div>

      {patient && (
        <div className="card">
          <h3>2. Choose doctor, date, slot, type</h3>
          <div className="row">
            <div>
              <label>Doctor</label>
              <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                <option value="">— select —</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.user ? `${d.user.firstName} ${d.user.lastName}` : d.id} · {d.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="CONSULTATION">Consultation</option>
                <option value="FOLLOWUP">Follow-up (50%)</option>
                <option value="EMERGENCY">Emergency (150%)</option>
              </select>
            </div>
          </div>
          <div style={{ height: 12 }} />
          <label>Reason</label>
          <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
          <div style={{ height: 12 }} />
          {!slots.length ? <p className="muted">No slots for this date (pick a different date).</p> : (
            <div className="grid">
              {slots.map((s) => (
                <div key={s.id} className={`slot ${slotId === s.id ? "selected" : ""}`} onClick={() => setSlotId(s.id)}>
                  {new Date(s.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              ))}
            </div>
          )}
          {err && <div className="error">{err}</div>}
          {ok && <div style={{ color: "#166534", marginTop: 8 }}>{ok}</div>}
          <div style={{ height: 12 }} />
          <button className="primary" disabled={busy || !slotId} onClick={book}>{busy ? "Booking…" : "Book appointment"}</button>
        </div>
      )}
    </>
  );
}
