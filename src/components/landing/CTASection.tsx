import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blob-shape blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight mb-6 animate-fade-in-up"
          >
            Ready to ace{" "}
            <span className="font-editorial italic text-primary">your next interview?</span>
          </h2>

          <p 
            className="text-muted-foreground text-lg max-w-md mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Join thousands who've improved their interview skills. 
            Start practicing for free today.
          </p>

          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
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
          </div>

          <p 
            className="mt-6 text-sm text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            No credit card required · Free plan available
          </p>
        </div>
      </div>
    </section>
  );
}
