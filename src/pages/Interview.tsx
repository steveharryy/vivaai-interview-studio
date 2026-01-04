import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Clock,
  BarChart3,
  CheckCircle2,
  XCircle,
  Loader2,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  feedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
}

const sampleQuestions = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths?",
  "Describe a challenging project you've worked on.",
  "How do you handle conflict in a team?",
  "Where do you see yourself in 5 years?",
];

export default function Interview() {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interviewStarted) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startInterview = () => {
    setInterviewStarted(true);
    const firstQuestion: Message = {
      id: Date.now().toString(),
      role: "ai",
      content: sampleQuestions[0],
    };
    setMessages([firstQuestion]);
    
    if (mode === "video") {
      startVideo();
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsVideoOn(true);
        setIsMicOn(true);
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please enable camera access for video interviews.",
        variant: "destructive",
      });
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response with feedback
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70;
      const feedback: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: generateFeedback(score),
        feedback: {
          score,
          strengths: ["Clear communication", "Good structure"],
          improvements: ["Add more specific examples", "Be more concise"],
        },
      };

      setMessages((prev) => [...prev, feedback]);

      // Add next question if available
      if (currentQuestionIndex < sampleQuestions.length - 1) {
        setTimeout(() => {
          const nextQuestion: Message = {
            id: (Date.now() + 2).toString(),
            role: "ai",
            content: sampleQuestions[currentQuestionIndex + 1],
          };
          setMessages((prev) => [...prev, nextQuestion]);
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 1500);
      } else {
        // Interview complete
        setTimeout(() => {
          const completion: Message = {
            id: (Date.now() + 2).toString(),
            role: "ai",
            content: "🎉 Congratulations! You've completed this interview session. Check your analytics dashboard for detailed insights.",
          };
          setMessages((prev) => [...prev, completion]);
        }, 1500);
      }

      setIsLoading(false);
    }, 2000);
  };

  const generateFeedback = (score: number) => {
    if (score >= 90) return "Excellent response! Your answer was well-structured and demonstrated strong relevant experience.";
    if (score >= 80) return "Good answer! You covered the main points well. Consider adding more specific metrics next time.";
    if (score >= 70) return "Solid response. Try to be more specific with examples from your experience.";
    return "There's room for improvement. Focus on structuring your answer with clear examples.";
  };

  const getModeIcon = () => {
    switch (mode) {
      case "voice": return Mic;
      case "video": return Video;
      default: return Sparkles;
    }
  };

  const ModeIcon = getModeIcon();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                mode === "text" && "bg-blue-500/20 text-blue-500",
                mode === "voice" && "bg-orange-500/20 text-orange-500",
                mode === "video" && "bg-purple-500/20 text-purple-500"
              )}>
                <ModeIcon className="w-4 h-4" />
              </div>
              <span className="font-semibold capitalize">{mode} Interview</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {interviewStarted && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Q{currentQuestionIndex + 1}/{sampleQuestions.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex gap-6">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!interviewStarted ? (
            // Start Screen
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className={cn(
                  "w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center animate-float",
                  mode === "text" && "bg-gradient-to-br from-blue-500 to-cyan-500",
                  mode === "voice" && "bg-gradient-to-br from-orange-500 to-red-500",
                  mode === "video" && "bg-gradient-to-br from-purple-500 to-pink-500"
                )}>
                  <ModeIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Ready for your {mode} interview?</h2>
                <p className="text-muted-foreground mb-8">
                  {mode === "text" && "Type your responses to practice articulating your answers clearly."}
                  {mode === "voice" && "Speak your answers and get feedback on your communication skills."}
                  {mode === "video" && "Full video simulation with body language and presentation tips."}
                </p>
                <Button variant="hero" size="xl" onClick={startInterview}>
                  <ModeIcon className="w-5 h-5 mr-2" />
                  Start Interview
                </Button>
              </div>
            </div>
          ) : (
            // Chat Interface
            <>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 animate-fade-in",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      message.role === "ai" 
                        ? "bg-gradient-to-br from-primary to-accent" 
                        : "bg-secondary"
                    )}>
                      {message.role === "ai" ? (
                        <Brain className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <span className="text-sm font-medium">You</span>
                      )}
                    </div>
                    <div className={cn(
                      "flex-1 max-w-[80%]",
                      message.role === "user" && "flex flex-col items-end"
                    )}>
                      <div className={cn(
                        "glass-card p-4 rounded-2xl",
                        message.role === "user" && "bg-primary/10"
                      )}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.feedback && (
                        <div className="mt-3 glass-card p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={cn(
                              "text-2xl font-bold",
                              message.feedback.score >= 80 && "text-success",
                              message.feedback.score >= 60 && message.feedback.score < 80 && "text-warning",
                              message.feedback.score < 60 && "text-destructive"
                            )}>
                              {message.feedback.score}%
                            </div>
                            <span className="text-sm text-muted-foreground">Score</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            {message.feedback.strengths.map((s, i) => (
                              <div key={i} className="flex items-center gap-2 text-success">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{s}</span>
                              </div>
                            ))}
                            {message.feedback.improvements.map((s, i) => (
                              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                                <XCircle className="w-4 h-4" />
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="glass-card p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-muted-foreground">Analyzing your response...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="glass-card p-4 rounded-xl">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 p-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    {(mode === "voice" || mode === "video") && (
                      <Button
                        type="button"
                        variant={isMicOn ? "default" : "outline"}
                        size="icon"
                        onClick={toggleMic}
                      >
                        {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                    )}
                    {mode === "video" && (
                      <Button
                        type="button"
                        variant={isVideoOn ? "default" : "outline"}
                        size="icon"
                        onClick={toggleVideo}
                      >
                        {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  <Button type="submit" variant="hero" disabled={!input.trim() || isLoading}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Answer
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Video Preview (for video mode) */}
        {mode === "video" && interviewStarted && (
          <div className="w-80 shrink-0">
            <div className="glass-card p-4 rounded-xl sticky top-24">
              <h3 className="text-sm font-medium mb-3">Your Camera</h3>
              <div className="aspect-video bg-secondary/50 rounded-lg overflow-hidden mb-3">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isMicOn ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={toggleMic}
                >
                  {isMicOn ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
                  {isMicOn ? "Mute" : "Unmute"}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Video className="w-4 h-4 mr-1" /> : <VideoOff className="w-4 h-4 mr-1" />}
                  {isVideoOn ? "Stop" : "Start"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
