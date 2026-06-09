"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./sidebar/sidebar";
import { Navbar } from "./navbar/navbar";
import { MobileNav } from "./mobile-nav/mobile-nav";
import { useMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    if (!isMobile) setMobileDrawerOpen(false);
  }, [isMobile]);

  return (
    <div className="dashboard-root">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed((v) => !v)}
        />
      )}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && mobileDrawerOpen && (
          <>
            <motion.div
              key="overlay"
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.div
              key="drawer"
              className="mobile-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <Sidebar
                collapsed={false}
                onCollapse={() => setMobileDrawerOpen(false)}
                mobile
                onClose={() => setMobileDrawerOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className="dashboard-main"
        style={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? "72px" : "260px",
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Navbar
          onMenuClick={() => setMobileDrawerOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="dashboard-content">
          <motion.div
            key="page-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {isMobile && <MobileNav />}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          background: var(--color-bg-base);
          color: var(--color-text-primary);
        }

        .dashboard-root {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg-base);
        }
        .dashboard-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .dashboard-content {
          flex: 1;
          padding: 24px;
          padding-bottom: 80px;
        }
        @media (min-width: 768px) {
          .dashboard-content {
            padding: 32px;
            padding-bottom: 32px;
          }
        }
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 40;
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          z-index: 50;
          box-shadow: 4px 0 32px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
