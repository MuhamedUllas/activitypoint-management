import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../hooks/useActivities";
import { useCategories } from "../hooks/useCategories";
import StatusPill from "./StatusPill";
import { formatDate, categoryName } from "../utils/format";
import "./ActivityDetails.css";

export default function ActivityDetails() {
  const { id } = useParams();
  const { currentStudent } = useAuth();
  const { activities, loading } = useActivities(currentStudent?.uid);
  const { categories } = useCategories();

  const activity = activities.find((a) => a.id === id);

  if (loading) {
    return <p className="activity-list__empty">Loading{"\u2026"}</p>;
  }

  if (!activity) {
    return (
      <div className="activity-details">
        <p className="activity-list__empty">
          That activity could not be found in your ledger.
        </p>
        <Link to="/activities" className="panel__link">
          Back to ledger
        </Link>
      </div>
    );
  }

  return (
    <div className="activity-details">
      <Link to="/activities" className="activity-details__back">
        {"\u2190"} Back to ledger
      </Link>

      <div className="activity-details__card">
        <div className="activity-details__header">
          <div>
            <h1>{activity.title}</h1>
            <p className="activity-details__meta">
              {categoryName(categories, activity.category)} &middot;{" "}
              {formatDate(activity.date)}
            </p>
          </div>
          <StatusPill status={activity.status} />
        </div>

        <p className="activity-details__description">
          {activity.description}
        </p>

        <div className="activity-details__points">
          <div>
            <span className="activity-details__points-label">
              Points claimed
            </span>
            <span className="numeral activity-details__points-value">
              {activity.pointsClaimed}
            </span>
          </div>
          <div>
            <span className="activity-details__points-label">
              Points approved
            </span>
            <span className="numeral activity-details__points-value">
              {activity.pointsApproved}
            </span>
          </div>
        </div>

        {activity.status === "Pending" && (
          <p className="activity-details__note">
            This activity is awaiting review by the activity points
            committee. Approved points will be added to your dashboard total
            once verified.
          </p>
        )}
        {activity.status === "Rejected" && (
          <p className="activity-details__note activity-details__note--rejected">
            This claim was not approved in full. Contact your activity
            points coordinator if you believe this needs review.
          </p>
        )}
      </div>
    </div>
  );
}
