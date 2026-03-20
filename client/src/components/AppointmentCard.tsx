import React from "react";

interface AppointmentCardProps {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  department: string;
  onView?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  SCHEDULED: "#3498db",
  IN_PROGRESS: "#f39c12",
  COMPLETED: "#27ae60",
  CANCELLED: "#e74c3c",
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  patientName,
  doctorName,
  date,
  time,
  status,
  department,
  onView,
  onCancel,
}) => {
  return (
    <div className="appointment-card">
      <div
        className="appointment-status-bar"
        style={{ backgroundColor: statusColors[status] }}
      />
      <div className="appointment-card-body">
        <div className="appointment-header">
          <h4>{patientName}</h4>
          <span className="appointment-badge" style={{ color: statusColors[status] }}>
            {status}
          </span>
        </div>
        <p className="appointment-doctor">Dr. {doctorName}</p>
        <p className="appointment-dept">{department}</p>
        <div className="appointment-time">
          <span>{date}</span>
          <span>{time}</span>
        </div>
        <div className="appointment-actions">
          {onView && (
            <button className="btn btn-sm" onClick={() => onView(id)}>
              View
            </button>
          )}
          {onCancel && status === "SCHEDULED" && (
            <button className="btn btn-sm btn-danger" onClick={() => onCancel(id)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
