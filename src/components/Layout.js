import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/activities", label: "Activity Ledger" },
  { to: "/activities/new", label: "Add Activity" },
  { to: "/categories", label: "Categories" },
  { to: "/profile", label: "Profile" },
];

export default function Layout() {
  const { currentStudent, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="shell">
      <button
        className="shell__menu-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <aside className={`shell__sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="shell__brand">
          <span className="shell__brand-mark">AP</span>
          <div>
            <div className="shell__brand-name">Activity Points</div>
            <div className="shell__brand-sub">Management System</div>
          </div>
        </div>

        <nav className="shell__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `shell__nav-link ${isActive ? "is-active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shell__footer">
          {currentStudent && (
            <div className="shell__student">
              <div className="shell__student-name">{currentStudent.name}</div>
              <div className="shell__student-uid">{currentStudent.uid}</div>
            </div>
          )}
          <button className="shell__logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="shell__content">
        <Outlet />
      </main>
    </div>
  );
}
