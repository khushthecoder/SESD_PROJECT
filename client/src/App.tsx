import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { clearTokens, currentUser } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookAppointment from "./pages/BookAppointment";

function Nav() {
  const nav = useNavigate();
  const user = currentUser();
  return (
    <div className="nav">
      <strong>HealthSync</strong>
      {user && <span className="muted">/ {user.firstName} ({user.role})</span>}
      <div className="spacer" />
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && <Link to="/">Dashboard</Link>}
      {user?.role === "PATIENT" && <Link to="/book">Book</Link>}
      {user && (
        <button onClick={() => { clearTokens(); nav("/login"); }}>Logout</button>
      )}
    </div>
  );
}

function RoleHome() {
  const user = currentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "PATIENT") return <PatientDashboard />;
  if (user.role === "DOCTOR") return <DoctorDashboard />;
  if (user.role === "RECEPTIONIST") return <ReceptionistDashboard />;
  if (user.role === "ADMIN") return <AdminDashboard />;
  return null;
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/" element={<RoleHome />} />
      </Routes>
    </>
  );
}
