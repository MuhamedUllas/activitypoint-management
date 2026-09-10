import { useCallback, useEffect, useState } from "react";

const EXTRA_KEY = "apms.activities.extra";

function loadExtra() {
  try {
    const raw = localStorage.getItem(EXTRA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExtra(list) {
  localStorage.setItem(EXTRA_KEY, JSON.stringify(list));
}

export function useActivities(studentUid) {
  const [baseActivities, setBaseActivities] = useState([]);
  const [extraActivities, setExtraActivities] = useState(loadExtra());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/activities.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load activity records.");
        return res.json();
      })
      .then((data) => {
        setBaseActivities(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const all = [...baseActivities, ...extraActivities];
  const activities = studentUid
    ? all.filter((a) => a.studentUid === studentUid)
    : all;

  const addActivity = useCallback((activity) => {
    const record = {
      id: `LOCAL-${Date.now()}`,
      pointsApproved: 0,
      status: "Pending",
      ...activity,
    };
    setExtraActivities((prev) => {
      const next = [...prev, record];
      saveExtra(next);
      return next;
    });
    return record;
  }, []);

  return { activities, loading, error, addActivity };
}
