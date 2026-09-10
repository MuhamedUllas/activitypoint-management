import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../hooks/useActivities";
import { useCategories } from "../hooks/useCategories";
import StatusPill from "./StatusPill";
import { formatDate, categoryName } from "../utils/format";
import "./ActivityList.css";

const STATUS_OPTIONS = ["All", "Approved", "Pending", "Rejected"];

export default function ActivityList() {
  const { currentStudent } = useAuth();
  const { activities, loading } = useActivities(currentStudent?.uid);
  const { categories } = useCategories();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return activities
      .filter((a) =>
        categoryFilter === "all" ? true : a.category === categoryFilter
      )
      .filter((a) =>
        statusFilter === "All" ? true : a.status === statusFilter
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activities, categoryFilter, statusFilter]);

  const totalClaimed = filtered.reduce((sum, a) => sum + a.pointsClaimed, 0);
  const totalApproved = filtered.reduce(
    (sum, a) => sum + a.pointsApproved,
    0
  );

  return (
    <div className="activity-list">
      <header className="activity-list__header">
        <div>
          <h1>Activity Ledger</h1>
          <p className="activity-list__subtitle">
            Every activity you have submitted, with its review status.
          </p>
        </div>
        <Link to="/activities/new" className="dashboard__cta">
          + Add activity
        </Link>
      </header>

      <div className="activity-list__filters">
        <label className="filter">
          <span>Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="filter">
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p className="activity-list__empty">Loading{"\u2026"}</p>}

      {!loading && filtered.length === 0 && (
        <p className="activity-list__empty">
          No activities match these filters yet.
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="ledger-table">
          <div className="ledger-table__row ledger-table__row--head">
            <div>Activity</div>
            <div>Category</div>
            <div>Date</div>
            <div className="numeral">Claimed</div>
            <div className="numeral">Approved</div>
            <div>Status</div>
          </div>
          {filtered.map((a) => (
            <Link
              to={`/activities/${a.id}`}
              className="ledger-table__row"
              key={a.id}
            >
              <div className="ledger-table__title">{a.title}</div>
              <div>{categoryName(categories, a.category)}</div>
              <div>{formatDate(a.date)}</div>
              <div className="numeral">{a.pointsClaimed}</div>
              <div className="numeral">{a.pointsApproved}</div>
              <div>
                <StatusPill status={a.status} />
              </div>
            </Link>
          ))}
          <div className="ledger-table__row ledger-table__row--foot">
            <div>Total</div>
            <div />
            <div />
            <div className="numeral">{totalClaimed}</div>
            <div className="numeral">{totalApproved}</div>
            <div />
          </div>
        </div>
      )}
    </div>
  );
}
