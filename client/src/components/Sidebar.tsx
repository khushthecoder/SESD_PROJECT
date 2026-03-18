import React from "react";

interface SidebarItem {
  label: string;
  icon: string;
  path: string;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  onNavigate: (path: string) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, onNavigate, collapsed = false }) => {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <ul className="sidebar-menu">
        {items.map((item) => (
          <li
            key={item.path}
            className={`sidebar-item ${item.active ? "active" : ""}`}
            onClick={() => onNavigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
};
