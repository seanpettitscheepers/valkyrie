import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Layers, Target, Brain, ChartBar, Users, AlertCircle, ArrowRight } from "lucide-react";

export function MainContent() {
  return (
    <>
      {/* Why Valkyrie Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">
            Your Protector in the Digital Marketing Arena
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8">
            The digital marketing landscape can feel like a chaotic battlefield. With so many platforms, metrics, and strategies to juggle, how can you ensure your advertising budget is safe and your campaigns are effective?
          </p>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            That's where Valkyrie steps in. We're not just another SaaS platform—we're your trusted partner, your guardian, your secret weapon. Valkyrie unites your digital advertising accounts into one powerful hub, offering unparalleled insights, effortless campaign management, and cutting-edge optimization powered by AI.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: Shield,
                title: "Protect Your Investment",
                description: "Minimize waste with data-driven strategies and actionable insights across platforms."
              },
              {
                icon: Layers,
                title: "Simplify Your Campaigns",
                description: "Manage all your advertising channels from one unified dashboard."
              },
              {
                icon: Brain,
                title: "Maximize ROI",
                description: "Plan, execute, and optimize campaigns with AI-driven recommendations tailored to your goals."
              },
              {
                icon: ChartBar,
                title: "Conquer with Confidence",
                description: "Make decisions backed by real-time analytics, audience insights, and industry benchmarks."
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-background/60 backdrop-blur animate-fade-in">
                <CardContent className="pt-6">
                  <benefit.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              className="bg-gradient-brand hover:opacity-90 transition-opacity group"
            >
              Try Valkyrie Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">
            Built to Protect, Serve, and Empower
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Valkyrie offers an arsenal of features designed to simplify your digital marketing efforts and maximize results.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Layers,
                title: "Unified Dashboard",
                description: "See all your campaign performance across Facebook, Instagram, TikTok, LinkedIn, Google Ads, Amazon DSP, and more—all in one place."
              },
              {
                icon: Brain,
                title: "AI-Powered Optimization",
                description: "Get ChatGPT-powered recommendations for budget allocation, audience targeting, and campaign adjustments."
              },
              {
                icon: Target,
                title: "Planning Made Easy",
                description: "Use past audience insights and campaign data to plan new campaigns. Enter your budget, select platforms, and let Valkyrie suggest the best strategy."
              },
              {
                icon: Shield,
                title: "Custom Naming Taxonomies",
                description: "Standardize your campaign naming conventions effortlessly to maintain clarity and consistency across platforms."
              },
              {
                icon: Users,
                title: "Audience Insights",
                description: "Gain detailed reports on who's responding to your ads and use this knowledge to refine your future campaigns."
              },
              {
                icon: AlertCircle,
                title: "Risk Mitigation",
                description: "Analyze brand sentiment, track volume of mentions, and proactively identify potential brand risks in the digital ecosystem."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-background/60 backdrop-blur animate-fade-in">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
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
              See All Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-brand bg-clip-text text-transparent">
            Are You Ready to Conquer the Digital Marketing Battlefield?
          </h2>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-brand hover:opacity-90 transition-opacity group"
            >
              Start for Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-primary hover:bg-primary/10"
            >
              Book a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            Have questions? Contact us at support@valkyriehub.com
          </p>
        </div>
      </section>
    </>
  );
}