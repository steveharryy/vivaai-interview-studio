import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Target,
  Clock,
  BarChart3,
  MessageSquare,
  Mic,
  Video,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const performanceData = [
  { date: "Mon", score: 72 },
  { date: "Tue", score: 78 },
  { date: "Wed", score: 75 },
  { date: "Thu", score: 82 },
  { date: "Fri", score: 85 },
  { date: "Sat", score: 88 },
  { date: "Sun", score: 90 },
];

const skillsData = [
  { skill: "Communication", score: 85 },
  { skill: "Technical", score: 78 },
  { skill: "Problem Solving", score: 92 },
  { skill: "Leadership", score: 70 },
  { skill: "Teamwork", score: 88 },
];

const modeDistribution = [
  { name: "Text", value: 45, color: "#3b82f6" },
  { name: "Voice", value: 35, color: "#f97316" },
  { name: "Video", value: 20, color: "#a855f7" },
];

const insights = [
  { type: "success", message: "Your communication skills improved by 15% this week!" },
  { type: "warning", message: "Consider practicing more behavioral questions." },
  { type: "success", message: "Great job on maintaining consistent practice sessions." },
  { type: "info", message: "Try the video mode to practice body language." },
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Analytics Dashboard</span>
            </div>
          </div>

          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Target, label: "Current Score", value: "85%", trend: "+5%", trendUp: true },
            { icon: Clock, label: "Total Practice", value: "12.5h", trend: "+2.5h", trendUp: true },
            { icon: MessageSquare, label: "Interviews", value: "24", trend: "+8", trendUp: true },
            { icon: TrendingUp, label: "Improvement", value: "+18%", trend: "vs last month", trendUp: true },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card p-5 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-success' : 'text-destructive'}`}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mode Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Practice Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {modeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Breakdown */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Skills Breakdown</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                  <YAxis dataKey="skill" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg animate-fade-in ${
                    insight.type === 'success' ? 'bg-success/10' :
                    insight.type === 'warning' ? 'bg-warning/10' :
                    'bg-primary/10'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {insight.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  ) : insight.type === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{insight.message}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <h4 className="text-sm font-medium mb-3">Recommended Next Steps</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Practice 2 more video interviews this week
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Focus on leadership-related questions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Review feedback from recent sessions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
