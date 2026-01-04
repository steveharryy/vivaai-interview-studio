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

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="tag mb-4 animate-fade-in-up">Features</p>
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Everything you need to{" "}
            <span className="font-editorial italic text-primary">nail the interview</span>
          </h2>
          <p 
            className="mt-4 text-muted-foreground text-lg animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Built by people who've been through hundreds of interviews. We know what actually helps.
          </p>
        </div>

        {/* Features grid - asymmetric */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`feature-card animate-fade-in-up ${
                index === 0 || index === 5 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
