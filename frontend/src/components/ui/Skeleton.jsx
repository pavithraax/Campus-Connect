import React from "react";

export default function Skeleton({ variant = "text", className = "" }) {
  const cls = `skeleton ${variant} ${className}`;
  return <div className={cls} aria-hidden />;
}
