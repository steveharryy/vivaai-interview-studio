import { 
  Brain, 
  TrendingUp, 
  Mic, 
  Video, 
  MessageSquare, 
  BarChart3,
  Zap,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Adaptive AI Engine",
    description: "Our AI adjusts question difficulty and tone based on your performance in real-time.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageSquare,
    title: "Text Interviews",
    description: "Practice typing your responses with instant AI feedback and suggestions.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Mic,
    title: "Voice Interviews",
    description: "Speak naturally while AI analyzes your communication skills and confidence.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Video,
    title: "Video Interviews",
    description: "Full video simulation with body language tips and presentation feedback.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your progress with detailed charts and actionable insights.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Score Tracking",
    description: "Get scored on each answer and watch your improvement over time.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Receive immediate, constructive feedback after every response.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Industry-Specific",
    description: "Tailored questions for tech, finance, healthcare, and more industries.",
    gradient: "from-teal-500 to-cyan-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive interview preparation tools powered by cutting-edge AI technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card-hover p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
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
