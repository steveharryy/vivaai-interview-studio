const stats = [
  { value: "50k+", label: "Practice sessions", detail: "completed" },
  { value: "92%", label: "Success rate", detail: "after 10 sessions" },
  { value: "4.9", label: "User rating", detail: "out of 5" },
  { value: "3min", label: "Avg feedback", detail: "turnaround" },
];

export function StatsSection() {
  return (
    <section className="py-16 border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center lg:text-left animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
