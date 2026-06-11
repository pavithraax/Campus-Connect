import React from "react";
import Skeleton from "./ui/Skeleton";

export default function Loader() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Skeleton variant="avatar" />
        <div style={{ flex: 1 }}>
          <Skeleton variant="title" />
          <div style={{ height: 8 }} />
          <Skeleton variant="text" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </div>
    </div>
  );
}
