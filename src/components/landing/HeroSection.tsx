import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Mic, Video, MessageSquare, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh" />
      
      {/* Animated Blobs */}
      <div className="blob top-20 left-20 w-80 h-80 bg-primary/30" />
      <div className="blob bottom-20 right-20 w-96 h-96 bg-accent/30" style={{ animationDelay: "2s" }} />
      <div className="blob top-1/2 left-1/2 w-64 h-64 bg-purple-500/20" style={{ animationDelay: "4s" }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-8 animate-fade-in animate-bounce-subtle">
            <Zap className="w-4 h-4" />
            <span>Powered by Advanced AI • Join 50,000+ Students</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in-up leading-[1.1]" style={{ animationDelay: "0.1s" }}>
            Nail Every Interview
            <br />
            <span className="neon-text">Like a Pro</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in-up font-light" style={{ animationDelay: "0.2s" }}>
            Practice with AI that adapts to you. Get real-time feedback,
            boost your confidence, and land your dream job.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/practice">
              <Button variant="hero" size="xl" className="group text-lg px-10 py-7 neon-glow">
                Start Free Practice
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Button variant="glass" size="xl" className="group text-lg px-8 py-7">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: MessageSquare, label: "Text Interview", gradient: "from-cyan-400 to-teal-400" },
              { icon: Mic, label: "Voice Interview", gradient: "from-orange-400 to-rose-400" },
              { icon: Video, label: "Video Interview", gradient: "from-violet-400 to-purple-400" },
            ].map((feature) => (
              <Link
                key={feature.label}
                to="/practice"
                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-secondary/80 transition-all duration-300"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{feature.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 rounded-3xl blur-3xl opacity-50 animate-pulse-slow" />
            
            {/* Main Card */}
            <div className="relative glass-card p-2 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-br from-card via-card to-secondary/20 rounded-2xl p-8 sm:p-12 min-h-[350px] sm:min-h-[450px] flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center animate-float neon-glow">
                      <Sparkles className="w-12 h-12 text-primary-foreground" />
                    </div>
                    {/* Orbiting Elements */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center animate-bounce-subtle">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-lg bg-orange-400 flex items-center justify-center animate-bounce-subtle" style={{ animationDelay: "0.5s" }}>
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">Interactive AI Interviewer</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Experience realistic interviews with our adaptive AI that learns your strengths and helps you improve
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}