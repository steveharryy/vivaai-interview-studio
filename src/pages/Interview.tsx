import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
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
  Brain,
  Zap,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { evaluateAnswer, type EvaluationResponse } from "@/lib/evaluateAnswer";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  evaluation?: EvaluationResponse;
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
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

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

  // Initialize Speech Recognition for voice mode
  useEffect(() => {
    if ((mode === "voice" || mode === "video") && 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInput(prev => prev + ' ' + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [mode]);

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

    // Speak the first question
    if ((mode === "voice" || mode === "video") && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleQuestions[0]);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
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
    if (isMicOn) {
      setIsMicOn(false);
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      setIsMicOn(true);
      setIsListening(true);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getVideoTracks();
      tracks.forEach(track => track.enabled = !isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentAnswer = input.trim();
    setInput("");
    setIsLoading(true);

    // Stop listening while processing
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      // Call the real AI evaluation endpoint
      const evaluation = await evaluateAnswer({
        interviewType: `${mode} interview`,
        currentQuestion: sampleQuestions[currentQuestionIndex],
        candidateAnswer: currentAnswer,
      });

      console.log('AI Evaluation:', evaluation);

      // Generate feedback based on AI evaluation
      const getStrengths = (eval_: EvaluationResponse): string[] => {
        const strengths: string[] = [];
        if (eval_.confidence === 'high') strengths.push('Confident delivery');
        if (!eval_.hesitation) strengths.push('Clear and direct response');
        if (eval_.score >= 7) strengths.push('Strong content relevance');
        if (eval_.score >= 8) strengths.push('Excellent structure');
        return strengths.length > 0 ? strengths : ['Completed the response'];
      };

      const getImprovements = (eval_: EvaluationResponse): string[] => {
        const improvements: string[] = [];
        if (eval_.confidence === 'low') improvements.push('Build more confidence in delivery');
        if (eval_.hesitation) improvements.push('Reduce filler words and hesitations');
        if (eval_.score < 7) improvements.push('Add more specific examples');
        if (eval_.score < 6) improvements.push('Focus on answering the question directly');
        return improvements.length > 0 ? improvements : ['Continue practicing'];
      };

      const feedback: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: evaluation.summary,
        evaluation,
        feedback: {
          score: evaluation.score * 10, // Convert 1-10 to percentage-like display
          strengths: getStrengths(evaluation),
          improvements: getImprovements(evaluation),
        },
      };

      setMessages((prev) => [...prev, feedback]);

      // Speak feedback for voice/video modes
      if ((mode === "voice" || mode === "video") && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(evaluation.summary);
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }

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

          // Speak next question
          if ((mode === "voice" || mode === "video") && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(sampleQuestions[currentQuestionIndex + 1]);
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
          }
        }, 2000);
      } else {
        // Interview complete
        setTimeout(() => {
          const completion: Message = {
            id: (Date.now() + 2).toString(),
            role: "ai",
            content: "🎉 Congratulations! You've completed this interview session. Check your analytics dashboard for detailed insights.",
          };
          setMessages((prev) => [...prev, completion]);
        }, 2000);
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      toast({
        title: "Evaluation Error",
        description: error instanceof Error ? error.message : "Failed to evaluate your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFeedback = (score: number) => {
    if (score >= 90) return "Excellent response! Your answer was well-structured and demonstrated strong relevant experience.";
    if (score >= 80) return "Good answer! You covered the main points well. Consider adding more specific metrics next time.";
    if (score >= 70) return "Solid response. Try to be more specific with examples from your experience.";
    return "There's room for improvement. Focus on structuring your answer with clear examples.";
  };

  const getModeConfig = () => {
    switch (mode) {
      case "voice": 
        return { 
          icon: Mic, 
          gradient: "from-orange-400 to-rose-500",
          bgGradient: "from-orange-400/20 to-rose-500/20"
        };
      case "video": 
        return { 
          icon: Video, 
          gradient: "from-violet-400 to-purple-500",
          bgGradient: "from-violet-400/20 to-purple-500/20"
        };
      default: 
        return { 
          icon: MessageSquare, 
          gradient: "from-cyan-400 to-teal-500",
          bgGradient: "from-cyan-400/20 to-teal-500/20"
        };
    }
  };

  const modeConfig = getModeConfig();
  const ModeIcon = modeConfig.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                modeConfig.gradient
              )}>
                <ModeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold capitalize">{mode} Interview</span>
                {isListening && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    Listening...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {interviewStarted && (
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">{formatTime(timeElapsed)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
              <BarChart3 className="w-4 h-4" />
              <span>Q{currentQuestionIndex + 1}/{sampleQuestions.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex gap-6 relative z-10">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!interviewStarted ? (
            // Start Screen
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-lg">
                <div className={cn(
                  "w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br flex items-center justify-center animate-float neon-glow",
                  modeConfig.gradient
                )}>
                  <ModeIcon className="w-12 h-12 text-white" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-4">Ready for your {mode} interview?</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {mode === "text" && "Type your responses to practice articulating your answers clearly and professionally."}
                  {mode === "voice" && "Speak your answers naturally and get AI feedback on your communication and confidence."}
                  {mode === "video" && "Full video simulation with body language analysis and presentation tips."}
                </p>
                <Button variant="hero" size="xl" onClick={startInterview} className="neon-glow">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Interview
                </Button>
              </div>
            </div>
          ) : (
            // Chat Interface
            <>
              <div className="flex-1 overflow-y-auto space-y-5 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4 animate-fade-in",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      message.role === "ai" 
                        ? "bg-gradient-to-br from-primary to-accent" 
                        : "bg-gradient-to-br from-secondary to-muted"
                    )}>
                      {message.role === "ai" ? (
                        <Brain className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <span className="text-sm font-bold">You</span>
                      )}
                    </div>
                    <div className={cn(
                      "flex-1 max-w-[80%]",
                      message.role === "user" && "flex flex-col items-end"
                    )}>
                      <div className={cn(
                        "glass-card p-5 rounded-2xl",
                        message.role === "user" && "bg-primary/10 border-primary/30"
                      )}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      
                      {message.feedback && (
                        <div className="mt-4 glass-card p-5 rounded-2xl border-primary/20">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "font-display text-3xl font-bold",
                                message.feedback.score >= 80 && "text-success",
                                message.feedback.score >= 60 && message.feedback.score < 80 && "text-warning",
                                message.feedback.score < 60 && "text-destructive"
                              )}>
                                {message.feedback.score}%
                              </div>
                              <span className="text-sm text-muted-foreground">Your Score</span>
                            </div>
                            {message.evaluation && (
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "px-2 py-1 rounded-lg text-xs font-medium",
                                  message.evaluation.confidence === 'high' && "bg-success/20 text-success",
                                  message.evaluation.confidence === 'medium' && "bg-warning/20 text-warning",
                                  message.evaluation.confidence === 'low' && "bg-destructive/20 text-destructive"
                                )}>
                                  {message.evaluation.confidence.toUpperCase()} confidence
                                </span>
                                {message.evaluation.hesitation && (
                                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-accent/20 text-accent flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Hesitation detected
                                  </span>
                                )}
                              </div>
                            )}
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
                  <div className="flex gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="glass-card p-5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-muted-foreground">Analyzing your response...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="glass-card p-5 rounded-2xl">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === "text" ? "Type your answer here..." : "Your speech will appear here, or type manually..."}
                  className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 p-0 text-base"
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
                        className={cn(
                          "rounded-xl transition-all",
                          isMicOn && "bg-primary animate-pulse-glow"
                        )}
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
                        className="rounded-xl"
                      >
                        {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  <Button type="submit" variant="hero" disabled={!input.trim() || isLoading} className="rounded-xl">
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
            <div className="glass-card p-5 rounded-2xl sticky top-24">
              <h3 className="font-display text-sm font-semibold mb-4">Your Camera</h3>
              <div className="aspect-video bg-secondary/30 rounded-xl overflow-hidden mb-4">
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
                  className="flex-1 rounded-xl"
                  onClick={toggleMic}
                >
                  {isMicOn ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
                  {isMicOn ? "Mute" : "Unmute"}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "outline"}
                  size="sm"
                  className="flex-1 rounded-xl"
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