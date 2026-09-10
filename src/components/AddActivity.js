import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../hooks/useActivities";
import { useCategories } from "../hooks/useCategories";
import "./AddActivity.css";

const emptyForm = {
  title: "",
  category: "",
  date: "",
  description: "",
  pointsClaimed: "",
};

export default function AddActivity() {
  const { currentStudent } = useAuth();
  const { addActivity } = useActivities(currentStudent?.uid);
  const { categories } = useCategories();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Give your activity a title.";
    if (!form.category) next.category = "Choose a category.";
    if (!form.date) next.date = "Select the date it took place.";
    if (!form.description.trim())
      next.description = "Add a short description.";
    const pts = Number(form.pointsClaimed);
    if (!form.pointsClaimed || Number.isNaN(pts) || pts <= 0) {
      next.pointsClaimed = "Enter the points you are claiming.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addActivity({
      studentUid: currentStudent.uid,
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      description: form.description.trim(),
      pointsClaimed: Number(form.pointsClaimed),
    });

    setSubmitted(true);
    setForm(emptyForm);
  };

  return (
    <div className="add-activity">
      <h1>Add Activity</h1>
      <p className="add-activity__subtitle">
        Submit a new activity for review. It will appear in your ledger as
        Pending until approved.
      </p>

      {submitted && (
        <div className="add-activity__success">
          Activity submitted for review.{" "}
          <button
            type="button"
            className="add-activity__link"
            onClick={() => navigate("/activities")}
          >
            View your ledger
          </button>
        </div>
      )}

      <form className="add-activity__form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span className="field__label">Activity title</span>
          <input
            className="field__input"
            type="text"
            value={form.title}
            onChange={handleChange("title")}
            placeholder="e.g. Regional Robotics Workshop"
          />
          {errors.title && <span className="field__error">{errors.title}</span>}
        </label>

        <div className="add-activity__row">
          <label className="field">
            <span className="field__label">Category</span>
            <select value={form.category} onChange={handleChange("category")}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="field__error">{errors.category}</span>
            )}
          </label>

          <label className="field">
            <span className="field__label">Date</span>
            <input
              className="field__input"
              type="date"
              value={form.date}
              onChange={handleChange("date")}
            />
            {errors.date && <span className="field__error">{errors.date}</span>}
          </label>
        </div>

        <label className="field">
          <span className="field__label">Description</span>
          <textarea
            className="field__input"
            rows={4}
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Briefly describe what you did and your role."
          />
          {errors.description && (
            <span className="field__error">{errors.description}</span>
          )}
        </label>

        <label className="field field--narrow">
          <span className="field__label">Points claimed</span>
          <input
            className="field__input"
            type="number"
            min="1"
            value={form.pointsClaimed}
            onChange={handleChange("pointsClaimed")}
            placeholder="e.g. 10"
          />
          {errors.pointsClaimed && (
            <span className="field__error">{errors.pointsClaimed}</span>
          )}
        </label>

        <button className="add-activity__submit" type="submit">
          Submit for review
        </button>
      </form>
    </div>
  );
}
