import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateVibe } from "@/hooks/use-vibes";
import { Plus, Smile, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJIS = ["😎", "🚀", "💡", "🎉", "🔥", "💻", "🌈", "🍕", "👾", "❤️", "✨", "🎵"];
const COLORS = [
  { class: "bg-yellow-200", label: "Sunshine" },
  { class: "bg-pink-200", label: "Bubblegum" },
  { class: "bg-blue-200", label: "Sky" },
  { class: "bg-green-200", label: "Mint" },
  { class: "bg-purple-200", label: "Lavendar" },
  { class: "bg-white", label: "Clean" },
];

export function CreateVibeDialog() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0].class);
  
  const { mutate: createVibe, isPending } = useCreateVibe();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Randomize position slightly around center
    const x = window.innerWidth / 2 - 128 + (Math.random() * 100 - 50);
    const y = window.innerHeight / 2 - 128 + (Math.random() * 100 - 50);
    const rotation = Math.random() * 10 - 5; // -5 to 5 degrees

    createVibe(
      { content, emoji, color, x: Math.floor(x), y: Math.floor(y), rotation: Math.floor(rotation) },
      {
        onSuccess: () => {
          setOpen(false);
          setContent("");
          // Keep other prefs or reset? Let's reset for fresh vibes
          setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
          setColor(COLORS[Math.floor(Math.random() * COLORS.length)].class);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="rounded-full h-16 px-8 shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-105 transition-all text-lg font-display gap-2 bg-gradient-to-r from-primary to-accent border-2 border-white/20"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          Add Vibe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-0 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center flex items-center justify-center gap-2">
            Create a Vibe <span className="text-3xl">✨</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground font-semibold">Message</Label>
            <div className="relative">
              <Input
                placeholder="What's the vibe?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="pl-12 h-14 rounded-2xl text-lg bg-slate-50 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                autoFocus
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                {emoji}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground font-semibold">Mood Emoji</Label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "w-10 h-10 text-xl rounded-xl hover:bg-white hover:shadow-sm transition-all flex items-center justify-center",
                    emoji === e ? "bg-white shadow-md scale-110 ring-2 ring-primary ring-offset-1" : "opacity-70 hover:opacity-100"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground font-semibold">Card Color</Label>
            <div className="flex gap-3 justify-center">
              {COLORS.map((c) => (
                <button
                  key={c.class}
                  type="button"
                  onClick={() => setColor(c.class)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all hover:scale-110",
                    c.class,
                    color === c.class ? "border-primary scale-110 shadow-lg ring-2 ring-primary/20 ring-offset-2" : "border-transparent opacity-80"
                  )}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!content.trim() || isPending}
            className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {isPending ? "Posting..." : "Post Vibe 🚀"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
