import React from "react";

export default function Button({ variant = "primary", children, className = "", ...rest }) {
  const base = variant === "outline" ? "btn-outline" : "btn-primary";
  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
}
