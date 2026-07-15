"use client";

import { motion } from "motion/react";
import Card from "@/components/ui/Card";
import { impactStats } from "@/lib/mock-data";

export default function ImpactStats() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-lg text-center"
        >
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            What autonomy changes
          </h2>
          <p className="mt-3 text-mist">Measured across pilot deployments with early institutional partners.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {impactStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
            >
              <Card className="flex h-full flex-col justify-between p-6">
                <span className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-3 text-xs leading-snug text-mist">{stat.label}</span>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
