import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, MessageSquare, Mic, Video } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-transparent to-transparent" />
      <motion.div 
        className="absolute top-32 right-[15%] w-[400px] h-[400px] bg-primary/8 blob-shape blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute bottom-20 left-[10%] w-[300px] h-[300px] bg-accent/6 blob-shape blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left column - Text content */}
          <motion.div 
            className="max-w-xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Tag */}
            <motion.div className="tag mb-6" variants={fadeInUp}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Now with adaptive AI
            </motion.div>

            {/* Headline - Editorial style */}
            <motion.h1 variants={fadeInUp}>
              <span className="block text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] mb-2">
                Practice interviews
              </span>
              <span className="block font-editorial text-5xl sm:text-6xl lg:text-7xl text-primary italic">
                that actually help
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md"
              variants={fadeInUp}
            >
              AI-powered mock interviews that adapt to your skill level. 
              Get real feedback, track your progress, and walk into your 
              next interview with confidence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap items-center gap-3 mt-8"
              variants={fadeInUp}
            >
              <Link to="/practice">
                <Button size="lg" className="group gap-2 rounded-full px-6">
                  Start practicing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="gap-2 rounded-full text-muted-foreground hover:text-foreground">
                <Play className="w-4 h-4" />
                Watch demo
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div 
              className="flex items-center gap-4 mt-10 pt-8 border-t border-border/50"
              variants={fadeInUp}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">2,400+</span> interviews completed this week
              </p>
            </motion.div>
          </motion.div>

          {/* Right column - Visual */}
          <motion.div 
            className="relative lg:pl-8"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            {/* Main interview card mockup */}
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute inset-4 bg-primary/15 rounded-3xl blur-2xl" />
              
              {/* Card */}
              <motion.div 
                className="relative bg-card border border-border/60 rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Technical Interview</p>
                      <p className="text-xs text-muted-foreground">Question 3 of 5</p>
                    </div>
                  </div>
                  <div className="tag-warm text-[10px]">Medium</div>
                </div>

                {/* Question */}
                <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                  <p className="text-sm leading-relaxed">
                    "Tell me about a time when you had to solve a complex 
                    problem with limited resources. How did you approach it?"
                  </p>
                </div>

                {/* Answer area mockup */}
                <div className="border border-border/60 rounded-xl p-4 min-h-[100px]">
                  <p className="text-sm text-muted-foreground">
                    In my previous role, we faced a situation where...
                    <span className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 animate-pulse" />
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-muted-foreground">AI is listening</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Mic className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Video className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating feedback card */}
              <motion.div 
                className="absolute -right-4 -bottom-4 lg:-right-8 lg:-bottom-6 bg-card border border-border/60 rounded-xl p-4 shadow-lg max-w-[200px]"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-success text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-0.5">Strong answer</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Good use of STAR method. Consider adding metrics.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
