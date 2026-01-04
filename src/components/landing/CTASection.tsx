import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blob-shape blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight mb-6"
            variants={fadeInUp}
          >
            Ready to ace{" "}
            <span className="font-editorial italic text-primary">your next interview?</span>
          </motion.h2>

          <motion.p 
            className="text-muted-foreground text-lg max-w-md mx-auto mb-8"
            variants={fadeInUp}
          >
            Join thousands who've improved their interview skills. 
            Start practicing for free today.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            variants={fadeInUp}
          >
            <Link to="/practice">
              <Button size="lg" className="group gap-2 rounded-full px-8">
                Start free practice
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="ghost" size="lg" className="rounded-full text-muted-foreground hover:text-foreground">
                Sign in
              </Button>
            </Link>
          </motion.div>

          <motion.p 
            className="mt-6 text-sm text-muted-foreground"
            variants={fadeInUp}
          >
            No credit card required · Free plan available
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
