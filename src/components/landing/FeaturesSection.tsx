import { 
  Brain, 
  TrendingUp, 
  Mic, 
  Video, 
  MessageSquare, 
  BarChart3,
  Zap,
  Shield,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Adaptive AI Engine",
    description: "Our AI adjusts difficulty and tone based on your real-time performance signals.",
    gradient: "from-cyan-400 to-teal-500",
  },
  {
    icon: MessageSquare,
    title: "Text Interviews",
    description: "Practice typing responses with instant AI feedback and writing tips.",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: Mic,
    title: "Voice Interviews",
    description: "Speak naturally while AI analyzes your communication and confidence.",
    gradient: "from-orange-400 to-rose-500",
  },
  {
    icon: Video,
    title: "Video Interviews",
    description: "Full video simulation with body language and presentation feedback.",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track progress with beautiful charts and actionable insights.",
    gradient: "from-emerald-400 to-green-500",
  },
  {
    icon: BarChart3,
    title: "Score Tracking",
    description: "Get scored on each answer and watch your improvement over time.",
    gradient: "from-yellow-400 to-amber-500",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Receive immediate, constructive feedback after every response.",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    icon: Shield,
    title: "Industry-Specific",
    description: "Tailored questions for tech, finance, healthcare, and more.",
    gradient: "from-fuchsia-400 to-purple-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Everything You Need</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Features That Make You{" "}
            <span className="gradient-text">Unstoppable</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive interview prep tools powered by cutting-edge AI technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card-hover p-7 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}