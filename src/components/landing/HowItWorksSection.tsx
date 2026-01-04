import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Choose Your Interview Type",
    description: "Select from text, voice, or video interview modes based on your preparation needs.",
    highlights: ["Multiple interview formats", "Industry-specific questions", "Customizable difficulty"],
  },
  {
    step: "02",
    title: "Practice with AI Interviewer",
    description: "Engage in realistic interview simulations with our adaptive AI that responds to your answers.",
    highlights: ["Real-time adaptation", "Natural conversation flow", "Dynamic follow-ups"],
  },
  {
    step: "03",
    title: "Get Instant Feedback",
    description: "Receive detailed feedback on your responses, including scores and improvement suggestions.",
    highlights: ["Actionable insights", "Performance scores", "Specific recommendations"],
  },
  {
    step: "04",
    title: "Track Your Progress",
    description: "Monitor your improvement over time with comprehensive analytics and performance trends.",
    highlights: ["Visual progress charts", "Strength analysis", "Goal tracking"],
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            How <span className="gradient-text">VivaAI</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to transform your interview preparation.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative flex gap-6 pb-12 last:pb-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {step.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px h-full bg-gradient-to-b from-primary/50 to-transparent mt-4" />
                )}
              </div>

              {/* Content */}
              <div className="glass-card p-6 flex-1 mb-4">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
