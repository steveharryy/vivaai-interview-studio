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
  LogOut,
  User,
  Settings,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const interviewModes = [
  {
    id: "text",
    icon: MessageSquare,
    title: "Text Interview",
    description: "Type your responses to AI-driven interview questions",
    color: "from-blue-500 to-cyan-500",
    available: true,
  },
  {
    id: "voice",
    icon: Mic,
    title: "Voice Interview",
    description: "Speak naturally while AI analyzes your communication",
    color: "from-orange-500 to-red-500",
    available: true,
  },
  {
    id: "video",
    icon: Video,
    title: "Video Interview",
    description: "Full video simulation with body language feedback",
    color: "from-purple-500 to-pink-500",
    available: true,
  },
];

const recentInterviews = [
  { id: 1, type: "text", role: "Software Engineer", score: 85, date: "2 hours ago" },
  { id: 2, type: "voice", role: "Product Manager", score: 78, date: "Yesterday" },
  { id: 3, type: "text", role: "Data Analyst", score: 92, date: "3 days ago" },
];

export default function Dashboard() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">VivaAI</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Ready for your next interview practice session?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Play, label: "Total Interviews", value: "12", change: "+3 this week" },
            { icon: TrendingUp, label: "Average Score", value: "85%", change: "+5% improvement" },
            { icon: Clock, label: "Practice Time", value: "4.5h", change: "This month" },
            { icon: BarChart3, label: "Skill Level", value: "Advanced", change: "Top 15%" },
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
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-primary mt-2">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Interview Modes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Start Interview</h2>
            <Link to="/analytics" className="text-sm text-primary hover:underline flex items-center gap-1">
              View Analytics <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interviewModes.map((mode, index) => (
              <Link
                key={mode.id}
                to={`/interview/${mode.id}`}
                className={cn(
                  "glass-card-hover p-6 cursor-pointer animate-fade-in-up",
                  selectedMode === mode.id && "ring-2 ring-primary"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className={cn(
                  "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                  mode.color
                )}>
                  <mode.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{mode.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{mode.description}</p>
                <Button variant="glass" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Interviews */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Interviews</h2>
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {recentInterviews.map((interview, index) => (
                <div
                  key={interview.id}
                  className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      interview.type === "text" && "bg-blue-500/20 text-blue-500",
                      interview.type === "voice" && "bg-orange-500/20 text-orange-500",
                      interview.type === "video" && "bg-purple-500/20 text-purple-500"
                    )}>
                      {interview.type === "text" && <MessageSquare className="w-5 h-5" />}
                      {interview.type === "voice" && <Mic className="w-5 h-5" />}
                      {interview.type === "video" && <Video className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-medium">{interview.role}</div>
                      <div className="text-sm text-muted-foreground">{interview.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "text-lg font-bold",
                      interview.score >= 90 && "text-success",
                      interview.score >= 70 && interview.score < 90 && "text-warning",
                      interview.score < 70 && "text-destructive"
                    )}>
                      {interview.score}%
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
