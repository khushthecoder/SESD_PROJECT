import React from "react";

interface NavbarProps {
  userName: string;
  role: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, role, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>HealthSync</h2>
      </div>
      <div className="navbar-info">
        <span className="navbar-user">{userName}</span>
        <span className="navbar-role">{role}</span>
        <button className="btn btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};
