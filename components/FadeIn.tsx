"use client";
import { motion } from "framer-motion";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
      {children}
    </motion.div>
  );
}
