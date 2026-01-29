import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useUpdateVibe } from "@/hooks/use-vibes";
import { cn } from "@/lib/utils";
import type { Vibe } from "@shared/schema";

const EMOJIS = ["😎", "🚀", "💡", "🎉", "🔥", "💻", "🌈", "🍕", "👾", "❤️", "✨", "🎵"];
const COLORS = [
  { class: "bg-yellow-200", label: "Sunshine" },
  { class: "bg-pink-200", label: "Bubblegum" },
  { class: "bg-blue-200", label: "Sky" },
  { class: "bg-green-200", label: "Mint" },
  { class: "bg-purple-200", label: "Lavender" },
  { class: "bg-white", label: "Clean" },
];

interface EditVibeDialogProps {
  vibe: Vibe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditVibeDialog({ vibe, open, onOpenChange }: EditVibeDialogProps) {
  const [content, setContent] = useState(vibe.content);
  const [emoji, setEmoji] = useState(vibe.emoji || EMOJIS[0]);
  const [color, setColor] = useState(vibe.color);
  
  const { mutate: updateVibe, isPending } = useUpdateVibe();

  useEffect(() => {
    if (open) {
      setContent(vibe.content);
      setEmoji(vibe.emoji || EMOJIS[0]);
      setColor(vibe.color);
    }
  }, [open, vibe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    updateVibe(
      { id: vibe.id, content, emoji, color },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center flex items-center justify-center gap-2">
            Editar Vibe <span className="text-3xl">✏️</span>
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Modifique seu cartão de vibe
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground font-semibold">Mensagem</Label>
            <div className="relative">
              <Input
                placeholder="Qual é a vibe?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="pl-12 h-14 rounded-2xl text-lg bg-slate-50 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                autoFocus
                data-testid="input-edit-content"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                {emoji}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground font-semibold">Emoji</Label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  data-testid={`button-emoji-${e}`}
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
            <Label className="text-muted-foreground font-semibold">Cor do Cartão</Label>
            <div className="flex gap-3 justify-center">
              {COLORS.map((c) => (
                <button
                  key={c.class}
                  type="button"
                  onClick={() => setColor(c.class)}
                  data-testid={`button-color-${c.class}`}
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
            data-testid="button-save-edit"
          >
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
