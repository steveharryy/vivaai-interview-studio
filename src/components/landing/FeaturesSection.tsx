import { 
  Brain, 
  TrendingUp, 
  Mic, 
  Video, 
  MessageSquare, 
  Zap,
  Target,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Adaptive difficulty",
    description: "Questions get harder or easier based on your performance. The AI learns your strengths and pushes your limits.",
  },
  {
    icon: Zap,
    title: "Instant feedback",
    description: "Get detailed analysis within seconds. Know exactly what worked and what needs improvement.",
  },
  {
    icon: MessageSquare,
    title: "Text mode",
    description: "Type your responses. Perfect for preparing written communication and async interviews.",
  },
  {
    icon: Mic,
    title: "Voice mode",
    description: "Speak naturally. AI analyzes your tone, pace, and confidence in real-time.",
  },
  {
    icon: Video,
    title: "Video mode",
    description: "Full simulation with camera. Practice body language and presentation skills.",
  },
  {
    icon: Target,
    title: "Industry specific",
    description: "Questions tailored to tech, finance, healthcare, consulting, and more.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    description: "See your improvement over time with clear metrics and trend analysis.",
  },
  {
    icon: BarChart3,
    title: "Coaching insights",
    description: "Personalized recommendations based on your interview history and patterns.",
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

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="max-w-2xl mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.p className="tag mb-4" variants={fadeInUp}>Features</motion.p>
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight"
            variants={fadeInUp}
          >
            Everything you need to{" "}
            <span className="font-editorial italic text-primary">nail the interview</span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-muted-foreground text-lg"
            variants={fadeInUp}
          >
            Built by people who've been through hundreds of interviews. We know what actually helps.
          </motion.p>
        </motion.div>

        {/* Features grid - asymmetric */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`feature-card ${
                index === 0 || index === 5 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
