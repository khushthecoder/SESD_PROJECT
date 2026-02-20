import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../api";

interface Doctor {
  id: string;
  specialization: string;
  consultationFee: string | number;
  user?: { firstName: string; lastName: string };
}

interface Slot { id: string; startsAt: string; endsAt: string; }

export default function BookAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState("");
  const [type, setType] = useState<"CONSULTATION" | "FOLLOWUP" | "EMERGENCY">("CONSULTATION");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    api.get<{ items: Doctor[] }>("/doctors").then((r) => setDoctors(r.items)).catch((e) => setErr(String(e)));
  }, []);

  async function loadSlots() {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    setErr(null);
    try {
      const r = await api.get<{ slots: Slot[] }>(`/doctors/${doctorId}/slots?date=${date}`);
      setSlots(r.slots);
      setSlotId("");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "failed to load slots");
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => { loadSlots(); }, [doctorId, date]);

  async function book() {
    if (!doctorId || !slotId) { setErr("select doctor and slot"); return; }
    setBooking(true);
    setErr(null);
    try {
      await api.post("/appointments", { doctorId, timeSlotId: slotId, type, reason: reason || undefined });
      nav("/");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "booking failed");
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Book an appointment</h2>
        <div className="row">
          <div>
            <label>Doctor</label>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
              <option value="">— select —</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user ? `${d.user.firstName} ${d.user.lastName}` : d.id} · {d.specialization} (₹{String(d.consultationFee)})
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
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="CONSULTATION">Consultation</option>
              <option value="FOLLOWUP">Follow-up (50%)</option>
              <option value="EMERGENCY">Emergency (150%)</option>
            </select>
          </div>
        </div>

        <div style={{ height: 12 }} />
        <label>Reason</label>
        <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>

      <div className="card">
        <h3>Available slots</h3>
        {loadingSlots && <p className="muted">Loading slots…</p>}
        {!loadingSlots && !slots.length && <p className="muted">No slots for this date.</p>}
        <div className="grid">
          {slots.map((s) => (
            <div
              key={s.id}
              className={`slot ${slotId === s.id ? "selected" : ""}`}
              onClick={() => setSlotId(s.id)}
            >
              {new Date(s.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          ))}
        </div>
      </div>

      {err && <div className="error">{err}</div>}
      <div className="card">
        <button className="primary" onClick={book} disabled={booking || !slotId}>
          {booking ? "Booking…" : "Confirm booking"}
        </button>
      </div>
    </div>
  );
}
