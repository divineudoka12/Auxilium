"use client";

import { motion, HTMLMotionProps } from "motion/react";
import clsx from "clsx";

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  strong?: boolean;
}

export default function Card({ className, hover = false, strong = false, children, ...props }: CardProps) {
  return (
    <motion.div
      className={clsx(
        "rounded-xl",
        strong ? "glass-strong" : "glass",
        hover && "transition-all duration-300 hover:border-hairline-strong hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
