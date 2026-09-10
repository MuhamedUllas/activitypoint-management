import React from "react";
import { statusTone } from "../utils/format";
import "./StatusPill.css";

export default function StatusPill({ status }) {
  const tone = statusTone(status);
  return <span className={`status-pill status-pill--${tone}`}>{status}</span>;
}
