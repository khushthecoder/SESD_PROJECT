import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "#3498db",
}) => {
  return (
    <div className="stats-card" style={{ borderTopColor: color }}>
      <div className="stats-card-header">
        <span className="stats-icon">{icon}</span>
        <h4 className="stats-title">{title}</h4>
      </div>
      <div className="stats-value">{value}</div>
      {trend && (
        <div className={`stats-trend ${trend.isPositive ? "positive" : "negative"}`}>
          <span>{trend.isPositive ? "▲" : "▼"}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="stats-trend-label">vs last month</span>
        </div>
      )}
    </div>
  );
};
