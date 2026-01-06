import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  MessageSquare, 
  Mic, 
  Video, 
  BarChart3, 
  Clock, 
  TrendingUp,
  Play,
  ChevronRight,
  Bell,
  User,
  Settings,
  Zap,
  Target,
  Rocket,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewDetailsDialog } from "@/components/dashboard/InterviewDetailsDialog";

const interviewModes = [
  {
    id: "text",
    icon: MessageSquare,
    title: "Text Interview",
    description: "Type your responses to AI-driven interview questions",
    gradient: "from-cyan-400 to-teal-500",
    shadowColor: "shadow-cyan-500/20",
    available: true,
  },
  {
    id: "voice",
    icon: Mic,
    title: "Voice Interview",
    description: "Speak naturally while AI analyzes your communication",
    gradient: "from-orange-400 to-rose-500",
    shadowColor: "shadow-rose-500/20",
    available: true,
  },
  {
    id: "video",
    icon: Video,
    title: "Video Interview",
    description: "Full video simulation with body language feedback",
    gradient: "from-violet-400 to-purple-500",
    shadowColor: "shadow-purple-500/20",
    available: true,
  },
];

const recentInterviews: Array<{
  id: number;
  type: "text" | "voice" | "video";
  role: string;
  score: number;
  date: string;
  duration?: string;
  questionsAnswered?: number;
  strengths?: string[];
  improvements?: string[];
}> = [
  { 
    id: 1, 
    type: "text", 
    role: "Software Engineer", 
    score: 85, 
    date: "2 hours ago",
    duration: "18 min",
    questionsAnswered: 10,
    strengths: ["Technical accuracy", "Problem-solving approach", "Clear explanations"],
    improvements: ["Add more examples", "Mention specific technologies", "Quantify achievements"]
  },
  { 
    id: 2, 
    type: "voice", 
    role: "Product Manager", 
    score: 78, 
    date: "Yesterday",
    duration: "22 min",
    questionsAnswered: 8,
    strengths: ["Strategic thinking", "User focus", "Communication clarity"],
    improvements: ["Reduce filler words", "Be more concise", "Add metrics"]
  },
  { 
    id: 3, 
    type: "text", 
    role: "Data Analyst", 
    score: 92, 
    date: "3 days ago",
    duration: "15 min",
    questionsAnswered: 9,
    strengths: ["Analytical depth", "Tool expertise", "Clear methodology"],
    improvements: ["Speak to business impact", "Simplify for non-technical audience"]
  },
];

export default function Dashboard() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<typeof recentInterviews[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (interview: typeof recentInterviews[0]) => {
    setSelectedInterview(interview);
    setDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed top-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-[150px]" />
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[150px]" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">VivaAI</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 relative z-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>Ready to practice?</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground text-lg">Ready for your next interview practice session?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { icon: Play, label: "Total Interviews", value: "12", change: "+3 this week", gradient: "from-cyan-400 to-teal-500" },
            { icon: TrendingUp, label: "Average Score", value: "85%", change: "+5% improvement", gradient: "from-emerald-400 to-green-500" },
            { icon: Clock, label: "Practice Time", value: "4.5h", change: "This month", gradient: "from-orange-400 to-amber-500" },
            { icon: Target, label: "Skill Level", value: "Advanced", change: "Top 15%", gradient: "from-violet-400 to-purple-500" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card p-6 animate-fade-in group hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                  stat.gradient
                )}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-primary mt-2 font-medium">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Interview Modes */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Start Interview</h2>
            <Link to="/analytics" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              View Analytics <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewModes.map((mode, index) => (
              <Link
                key={mode.id}
                to={`/interview/${mode.id}`}
                className={cn(
                  "glass-card-hover p-8 cursor-pointer animate-fade-in-up group",
                  selectedMode === mode.id && "ring-2 ring-primary"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
                  mode.gradient,
                  `shadow-lg ${mode.shadowColor}`
                )}>
                  <mode.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">{mode.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{mode.description}</p>
                <Button variant="glass" className="w-full group-hover:bg-primary/20 group-hover:border-primary/50">
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Practice
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Interviews */}
        <div>
          <h2 className="font-display text-2xl font-bold mb-6">Recent Interviews</h2>
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-border/30">
              {recentInterviews.map((interview, index) => (
                <div
                  key={interview.id}
                  className="p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      interview.type === "text" && "bg-gradient-to-br from-cyan-400/20 to-teal-400/20 text-cyan-400",
                      interview.type === "voice" && "bg-gradient-to-br from-orange-400/20 to-rose-400/20 text-orange-400",
                      interview.type === "video" && "bg-gradient-to-br from-violet-400/20 to-purple-400/20 text-violet-400"
                    )}>
                      {interview.type === "text" && <MessageSquare className="w-5 h-5" />}
                      {interview.type === "voice" && <Mic className="w-5 h-5" />}
                      {interview.type === "video" && <Video className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-display font-semibold">{interview.role}</div>
                      <div className="text-sm text-muted-foreground">{interview.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "font-display text-xl font-bold",
                      interview.score >= 90 && "text-success",
                      interview.score >= 70 && interview.score < 90 && "text-warning",
                      interview.score < 70 && "text-destructive"
                    )}>
                      {interview.score}%
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-xl hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleViewDetails(interview)}
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Details Dialog */}
        <InterviewDetailsDialog 
          interview={selectedInterview}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      </main>
    </div>
  );
}