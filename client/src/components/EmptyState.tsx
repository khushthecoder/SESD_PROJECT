import React from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title, description, icon = "📋", actionLabel, onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
};

export const NoAppointments: React.FC<{ onBook?: () => void }> = ({ onBook }) => (
  <EmptyState title="No appointments found" description="You don't have any upcoming appointments scheduled."
    icon="📅" actionLabel="Book Appointment" onAction={onBook} />
);

export const NoRecords: React.FC = () => (
  <EmptyState title="No medical records" description="Medical records will appear here after your visits." icon="🏥" />
);
