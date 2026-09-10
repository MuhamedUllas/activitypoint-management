import React from "react";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../hooks/useActivities";
import "./Profile.css";

export default function Profile() {
  const { currentStudent } = useAuth();
  const { activities } = useActivities(currentStudent?.uid);

  const approved = activities.filter((a) => a.status === "Approved");
  const pending = activities.filter((a) => a.status === "Pending");
  const rejected = activities.filter((a) => a.status === "Rejected");
  const totalPoints = approved.reduce((sum, a) => sum + a.pointsApproved, 0);

  if (!currentStudent) return null;

  const initials = currentStudent.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="profile">
      <h1>Profile</h1>

      <div className="profile__card">
        <div className="profile__avatar">{initials}</div>
        <div>
          <h2 className="profile__name">{currentStudent.name}</h2>
          <p className="profile__uid">{currentStudent.uid}</p>
        </div>
      </div>

      <div className="profile__details">
        <div className="profile__detail">
          <span className="profile__detail-label">Department</span>
          <span className="profile__detail-value">
            {currentStudent.department}
          </span>
        </div>
        <div className="profile__detail">
          <span className="profile__detail-label">Semester</span>
          <span className="profile__detail-value">
            {currentStudent.semester}
          </span>
        </div>
        <div className="profile__detail">
          <span className="profile__detail-label">Email</span>
          <span className="profile__detail-value">
            {currentStudent.email}
          </span>
        </div>
        <div className="profile__detail">
          <span className="profile__detail-label">Faculty advisor</span>
          <span className="profile__detail-value">
            {currentStudent.advisor}
          </span>
        </div>
      </div>

      <h2 className="profile__section-title">Activity summary</h2>
      <div className="profile__summary">
        <div className="profile__summary-figure">
          <span className="numeral profile__summary-value">
            {totalPoints}
          </span>
          <span className="profile__summary-label">Points earned</span>
        </div>
        <div className="profile__summary-figure">
          <span className="numeral profile__summary-value">
            {currentStudent.targetPoints}
          </span>
          <span className="profile__summary-label">Target points</span>
        </div>
        <div className="profile__summary-figure">
          <span className="numeral profile__summary-value">
            {approved.length}
          </span>
          <span className="profile__summary-label">Approved activities</span>
        </div>
        <div className="profile__summary-figure">
          <span className="numeral profile__summary-value">
            {pending.length}
          </span>
          <span className="profile__summary-label">Pending review</span>
        </div>
        <div className="profile__summary-figure">
          <span className="numeral profile__summary-value">
            {rejected.length}
          </span>
          <span className="profile__summary-label">Not approved</span>
        </div>
      </div>
    </div>
  );
}
