import { motion } from "framer-motion";

const stats = [
  { value: "50k+", label: "Practice sessions", detail: "completed" },
  { value: "92%", label: "Success rate", detail: "after 10 sessions" },
  { value: "4.9", label: "User rating", detail: "out of 5" },
  { value: "3min", label: "Avg feedback", detail: "turnaround" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export function StatsSection() {
  return (
    <section className="py-16 border-y border-border/40">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center lg:text-left"
              variants={itemVariants}
            >
              <p className="stat-number gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-foreground">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
