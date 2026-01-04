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

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <p className="tag mb-4 animate-fade-in-up">How it works</p>
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Simple process,{" "}
              <span className="font-editorial italic text-primary">real results</span>
            </h2>
          </div>
          <p 
            className="text-muted-foreground max-w-md lg:text-right animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Most users see significant improvement after just 5 practice sessions. No complicated setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border/60 -translate-x-4" />
              )}
              
              {/* Step card */}
              <div className="group">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
