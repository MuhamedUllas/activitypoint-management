import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "apms.session.uid";

export function AuthProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [currentUid, setCurrentUid] = useState(
    () => localStorage.getItem(SESSION_KEY) || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/students.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load student records.");
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const login = (uid, password) => {
    const match = students.find(
      (s) => s.uid.toLowerCase() === uid.trim().toLowerCase()
    );
    if (!match) {
      return { success: false, message: "No student found with that UID." };
    }
    if (match.password !== password) {
      return { success: false, message: "Incorrect password." };
    }
    localStorage.setItem(SESSION_KEY, match.uid);
    setCurrentUid(match.uid);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUid(null);
  };

  const currentStudent = students.find((s) => s.uid === currentUid) || null;

  return (
    <AuthContext.Provider
      value={{
        students,
        currentStudent,
        isAuthenticated: !!currentStudent,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
