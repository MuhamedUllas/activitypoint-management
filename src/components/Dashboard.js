import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../hooks/useActivities";
import { useCategories } from "../hooks/useCategories";
import StatusPill from "./StatusPill";
import { formatDate, categoryName } from "../utils/format";
import "./Dashboard.css";

export default function Dashboard() {
  const { currentStudent } = useAuth();
  const { activities, loading } = useActivities(currentStudent?.uid);
  const { categories } = useCategories();

  const approved = activities.filter((a) => a.status === "Approved");
  const totalPoints = approved.reduce((sum, a) => sum + a.pointsApproved, 0);
  const target = currentStudent?.targetPoints || 0;
  const remaining = Math.max(target - totalPoints, 0);
  const progressPct = target ? Math.min((totalPoints / target) * 100, 100) : 0;

  const pendingCount = activities.filter((a) => a.status === "Pending").length;

  const byCategory = categories.map((cat) => {
    const pts = approved
      .filter((a) => a.category === cat.id)
      .reduce((sum, a) => sum + a.pointsApproved, 0);
    return { ...cat, earned: pts };
  });

  const recent = [...activities]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1>Welcome back, {currentStudent?.name?.split(" ")[0]}</h1>
          <p className="dashboard__meta">
            {currentStudent?.uid} &nbsp;&middot;&nbsp; {currentStudent?.department}
            {" "}&nbsp;&middot;&nbsp; Semester {currentStudent?.semester}
          </p>
        </div>
        <Link to="/activities/new" className="dashboard__cta">
          + Add activity
        </Link>
      </header>

      <section className="ledger-summary">
        <div className="ledger-summary__figure">
          <span className="ledger-summary__label">Points earned</span>
          <span className="numeral ledger-summary__value">{totalPoints}</span>
        </div>
        <div className="ledger-summary__figure">
          <span className="ledger-summary__label">Target</span>
          <span className="numeral ledger-summary__value ledger-summary__value--muted">
            {target}
          </span>
        </div>
        <div className="ledger-summary__figure">
          <span className="ledger-summary__label">Remaining</span>
          <span className="numeral ledger-summary__value ledger-summary__value--muted">
            {remaining}
          </span>
        </div>
        <div className="ledger-summary__figure">
          <span className="ledger-summary__label">Pending review</span>
          <span className="numeral ledger-summary__value ledger-summary__value--muted">
            {pendingCount}
          </span>
        </div>

        <div className="ledger-summary__bar">
          <div
            className="ledger-summary__bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="ledger-summary__bar-caption">
          {progressPct.toFixed(0)}% of target reached
        </div>
      </section>

      <div className="dashboard__grid">
        <section className="panel">
          <h2 className="panel__title">Points by category</h2>
          <div className="category-bars">
            {byCategory.map((cat) => {
              const pct = cat.maxPoints
                ? Math.min((cat.earned / cat.maxPoints) * 100, 100)
                : 0;
              return (
                <div className="category-bars__row" key={cat.id}>
                  <div className="category-bars__label">{cat.name}</div>
                  <div className="category-bars__track">
                    <div
                      className="category-bars__fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="category-bars__value numeral">
                    {cat.earned}/{cat.maxPoints}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel__header-row">
            <h2 className="panel__title">Recent activity</h2>
            <Link to="/activities" className="panel__link">
              View ledger
            </Link>
          </div>
          {loading && <p className="panel__empty">Loading{"\u2026"}</p>}
          {!loading && recent.length === 0 && (
            <p className="panel__empty">
              No activities recorded yet. Add your first one to get started.
            </p>
          )}
          <ul className="recent-list">
            {recent.map((a) => (
              <li className="recent-list__item" key={a.id}>
                <div>
                  <div className="recent-list__title">{a.title}</div>
                  <div className="recent-list__meta">
                    {categoryName(categories, a.category)} &middot;{" "}
                    {formatDate(a.date)}
                  </div>
                </div>
                <StatusPill status={a.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
