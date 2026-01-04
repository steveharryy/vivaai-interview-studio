import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Pick your format",
    description: "Choose text, voice, or video based on the role you're preparing for. Select your industry for tailored questions.",
  },
  {
    number: "02",
    title: "Practice with AI",
    description: "Have a realistic conversation with our AI interviewer. It adapts to your answers and asks smart follow-ups.",
  },
  {
    number: "03",
    title: "Get feedback",
    description: "Receive instant, specific feedback. See what you did well and exactly where to improve.",
  },
  {
    number: "04",
    title: "Track progress",
    description: "Watch your scores improve over time. Get personalized coaching based on your patterns.",
  },
];

const headerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

const stepsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-xl">
            <motion.p className="tag mb-4" variants={fadeInUp}>How it works</motion.p>
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight"
              variants={fadeInUp}
            >
              Simple process,{" "}
              <span className="font-editorial italic text-primary">real results</span>
            </motion.h2>
          </div>
          <motion.p 
            className="text-muted-foreground max-w-md lg:text-right"
            variants={fadeInUp}
          >
            Most users see significant improvement after just 5 practice sessions. No complicated setup required.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={stepsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              variants={stepVariants}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden lg:block absolute top-8 left-full w-full h-px bg-border/60 -translate-x-4"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                  style={{ originX: 0 }}
                />
              )}
              
              {/* Step card */}
              <motion.div 
                className="group"
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-3xl font-medium text-primary/40 group-hover:text-primary transition-colors">
                    {step.number}
                  </span>
                  <div className="w-8 h-px bg-border group-hover:bg-primary/40 transition-colors" />
                </div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
