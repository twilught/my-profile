"use client";
import { motion } from "framer-motion";

export default function GradientDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mx-auto my-16 h-[1px] w-2/3 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent dark:via-sky-400/70"
    />
  );
}
