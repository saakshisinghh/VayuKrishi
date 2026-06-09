"use client";

interface SidebarGroupProps {
  label: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

export function SidebarGroup({ label, collapsed, children }: SidebarGroupProps) {
  return (
    <div className="sidebar-group" role="group" aria-label={label}>
      {!collapsed ? (
        <span className="sidebar-group__label" aria-hidden="true">{label}</span>
      ) : (
        <div className="sidebar-group__divider" />
      )}
      <div className="sidebar-group__items">{children}</div>

      <style jsx>{`
        .sidebar-group { margin-bottom: 4px; }
        .sidebar-group__label {
          display: block;
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
          padding: 14px 10px 4px;
          font-family: 'DM Sans', sans-serif;
          opacity: 0.6;
        }
        .sidebar-group__divider {
          height: 1px;
          background: var(--color-border-subtle);
          margin: 12px 8px;
        }
        .sidebar-group__items {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
      `}</style>
    </div>
  );
}
