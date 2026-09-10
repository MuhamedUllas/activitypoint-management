import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, isAuthenticated, loading, students } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!uid.trim() || !password) {
      setErrorMsg("Enter both your UID and password.");
      return;
    }
    const result = login(uid, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.message);
    }
  };

  const fillSample = (student) => {
    setUid(student.uid);
    setPassword(student.password);
    setErrorMsg("");
  };

  return (
    <div className="login">
      <div className="login__panel">
        <div className="login__mark">AP</div>
        <h1 className="login__title">Activity Points</h1>
        <p className="login__subtitle">Management System</p>
        <p className="login__blurb">
          Track co-curricular, technical, social and leadership activity
          points earned across your academic programme.
        </p>
      </div>

      <div className="login__form-wrap">
        <form className="login__form" onSubmit={handleSubmit}>
          <h2 className="login__form-title">Student log in</h2>

          <label className="field">
            <span className="field__label">UID</span>
            <input
              className="field__input"
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="e.g. CS2101"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="field__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>

          {errorMsg && <div className="login__error">{errorMsg}</div>}

          <button className="login__submit" type="submit" disabled={loading}>
            {loading ? "Loading records\u2026" : "Log in"}
          </button>

          {!loading && students.length > 0 && (
            <div className="login__sample">
              <span>Sample accounts:</span>
              <div className="login__sample-list">
                {students.map((s) => (
                  <button
                    type="button"
                    key={s.uid}
                    className="login__sample-chip"
                    onClick={() => fillSample(s)}
                  >
                    {s.uid}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
