import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Move, Palette, Users } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const features = [
    {
      icon: Sparkles,
      title: "Express Yourself",
      description: "Create colorful vibe cards with custom messages and emojis to share your mood.",
    },
    {
      icon: Move,
      title: "Drag & Drop",
      description: "Freely arrange your vibes anywhere on the canvas. Make it your own space!",
    },
    {
      icon: Palette,
      title: "Colorful Options",
      description: "Choose from a variety of vibrant colors to make each vibe unique.",
    },
    {
      icon: Users,
      title: "Shared Space",
      description: "See vibes from everyone in real-time. It's a collaborative canvas!",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
            About Vibe Playground
          </h1>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What is Vibe Playground?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                Vibe Playground is an interactive canvas where you can express your thoughts, feelings, 
                and ideas through colorful, draggable cards. Whether you're feeling creative, need to 
                share a quick thought, or just want to add some color to your day, Vibe Playground 
                gives you a fun and playful way to do it.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none">
            <CardContent className="pt-6 text-center">
              <h3 className="font-display text-2xl font-bold mb-4">Ready to vibe?</h3>
              <Link href="/">
                <Button size="lg" data-testid="button-start-vibing">
                  Start Playing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
