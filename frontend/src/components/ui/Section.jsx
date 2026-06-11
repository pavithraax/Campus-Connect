import React from "react";
import { motion } from "framer-motion";

export default function Section({ title, children, className = "" }) {
  return (
    <section className={`section ${className}`}>
      {title && <h2>{title}</h2>}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        {children}
      </motion.div>
    </section>
  );
}
