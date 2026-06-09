"use client";

import { CloudSun } from "lucide-react";

interface SidebarFooterProps {
  collapsed?: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div className="sidebar-footer">
      {!collapsed && (
        <div className="sidebar-footer__status">
          <div className="sidebar-footer__status-icon">
            <CloudSun size={13} aria-hidden="true" />
          </div>
          <div className="sidebar-footer__status-text">
            <span className="sidebar-footer__label">Season</span>
            <span className="sidebar-footer__value">Kharif 2025</span>
          </div>
        </div>
      )}
      <div className="sidebar-footer__version">
        {collapsed ? "v1" : "Vayukrishi v1.0"}
      </div>

      <style jsx>{`
        .sidebar-footer {
          padding: 12px 14px 16px;
          border-top: 1px solid var(--color-border-subtle);
          flex-shrink: 0;
        }
        .sidebar-footer__status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: var(--color-brand-green-alpha, rgba(45,106,79,0.07));
          border-radius: 9px;
          margin-bottom: 8px;
        }
        .sidebar-footer__status-icon {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: var(--color-brand-green, #2d6a4f);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sidebar-footer__status-text { display: flex; flex-direction: column; }
        .sidebar-footer__label {
          font-size: 10px;
          color: var(--color-text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sidebar-footer__value {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-brand-green, #2d6a4f);
        }
        .sidebar-footer__version {
          font-size: 11px;
          color: var(--color-text-muted);
          text-align: center;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
