import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  MessageSquare, 
  Mic, 
  Video, 
  ArrowLeft,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  Rocket,
  Brain,
  Users,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const interviewModes = [
  {
    id: "text",
    icon: MessageSquare,
    title: "Text Interview",
    description: "Type your responses and get instant AI feedback on structure and content",
    features: ["Real-time analysis", "Grammar suggestions", "Structure tips"],
    gradient: "from-cyan-400 via-teal-400 to-emerald-400",
    shadowColor: "shadow-cyan-500/25",
  },
  {
    id: "voice",
    icon: Mic,
    title: "Voice Interview",
    description: "Practice speaking naturally while AI evaluates your communication skills",
    features: ["Speech analysis", "Tone feedback", "Confidence scoring"],
    gradient: "from-orange-400 via-pink-500 to-rose-500",
    shadowColor: "shadow-pink-500/25",
  },
  {
    id: "video",
    icon: Video,
    title: "Video Interview",
    description: "Full simulation with body language analysis and presentation tips",
    features: ["Body language tips", "Eye contact tracking", "Full simulation"],
    gradient: "from-violet-400 via-purple-500 to-fuchsia-500",
    shadowColor: "shadow-purple-500/25",
  },
];

const industries = [
  { id: "tech", label: "Technology", icon: Brain },
  { id: "finance", label: "Finance", icon: Briefcase },
  { id: "healthcare", label: "Healthcare", icon: Users },
  { id: "general", label: "General", icon: Target },
];

export default function Practice() {
  const [selectedIndustry, setSelectedIndustry] = useState("general");

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg">Free Practice</h1>
                <p className="text-xs text-muted-foreground">AI-powered interview prep</p>
              </div>
            </div>
          </div>

          <Link to="/auth?mode=signup">
            <Button variant="hero" size="sm">
              <Rocket className="w-4 h-4 mr-2" />
              Sign Up Free
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6 animate-bounce-subtle">
            <Zap className="w-4 h-4" />
            <span>100% Free - No Credit Card Required</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Start Your{" "}
            <span className="neon-text">Interview Practice</span>
          </h1>
          
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Choose your interview mode and industry to get personalized AI-driven practice sessions
          </p>
        </div>

        {/* Industry Selection */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-center text-sm font-medium text-muted-foreground mb-4">Select Your Industry</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300",
                  selectedIndustry === industry.id
                    ? "bg-primary/20 border-primary text-primary neon-glow"
                    : "bg-secondary/30 border-border/50 hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <industry.icon className="w-4 h-4" />
                <span className="font-medium">{industry.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interview Modes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {interviewModes.map((mode, index) => (
            <Link
              key={mode.id}
              to={`/interview/${mode.id}`}
              className={cn(
                "group relative glass-card p-8 overflow-hidden animate-fade-in-up transition-all duration-500",
                "hover:scale-[1.02] hover:-translate-y-2"
              )}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Gradient Background on Hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                mode.gradient
              )} />

              {/* Icon */}
              <div className={cn(
                "relative w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                mode.gradient,
                `shadow-lg ${mode.shadowColor}`
              )}>
                <mode.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {mode.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {mode.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {mode.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Button variant="glass" className="w-full group-hover:bg-primary/20 group-hover:border-primary/50">
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Practice
                </Button>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="max-w-4xl mx-auto glass-card p-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, value: "50K+", label: "Active Users" },
              { icon: MessageSquare, value: "1M+", label: "Interviews" },
              { icon: Target, value: "85%", label: "Success Rate" },
              { icon: Clock, value: "24/7", label: "Available" },
            ].map((stat, index) => (
              <div key={stat.label} className="group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-display text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <p className="text-muted-foreground mb-4">
            Want to unlock all features and track your progress?
          </p>
          <Link to="/auth?mode=signup">
            <Button variant="hero" size="xl">
              Create Free Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}