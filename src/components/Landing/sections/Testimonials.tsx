import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-brand bg-clip-text text-transparent">
          Don't Just Take Our Word for It
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              quote: "Valkyrie transformed the way I run my advertising campaigns. I've saved time, money, and achieved better results than ever before.",
              author: "Sarah T.",
              role: "Small Business Owner"
            },
            {
              quote: "The audience insights Valkyrie provides are game-changing. I know exactly who my customers are and how to reach them.",
              author: "James L.",
              role: "Digital Marketer"
            },
            {
              quote: "With Valkyrie, I finally feel confident in my advertising strategy. It's like having a full team of experts in one app.",
              author: "Emma R.",
              role: "Startup Founder"
            }
          ].map((testimonial, index) => (
            <Card key={index} className="bg-background/60 backdrop-blur animate-fade-in">
              <CardContent className="pt-6">
                <p className="text-lg mb-4 text-muted-foreground">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            className="border-primary hover:bg-primary/10"
          >
            See More Success Stories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}