import React from "react";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../hooks/useActivities";
import { useCategories } from "../hooks/useCategories";
import "./Categories.css";

export default function Categories() {
  const { currentStudent } = useAuth();
  const { activities } = useActivities(currentStudent?.uid);
  const { categories, loading } = useCategories();

  const earnedFor = (id) =>
    activities
      .filter((a) => a.category === id && a.status === "Approved")
      .reduce((sum, a) => sum + a.pointsApproved, 0);

  if (loading) return <p className="activity-list__empty">Loading{"\u2026"}</p>;

  return (
    <div className="categories">
      <h1>Activity Categories</h1>
      <p className="categories__subtitle">
        Every approved activity is filed under one of these categories, each
        with its own point ceiling for the programme.
      </p>

      <div className="categories__grid">
        {categories.map((c) => (
          <article className="category-card" key={c.id}>
            <h2 className="category-card__title">{c.name}</h2>
            <p className="category-card__description">{c.description}</p>
            <div className="category-card__footer">
              <span className="numeral category-card__earned">
                {earnedFor(c.id)}
              </span>
              <span className="category-card__of"> / {c.maxPoints} pts</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
