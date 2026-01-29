import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { api } from "@shared/routes";
import { Loader2, PenLine, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Vibe } from "@shared/schema";

interface WriteDialogProps {
  vibes: Vibe[];
}

export function WriteDialog({ vibes }: WriteDialogProps) {
  const [open, setOpen] = useState(false);
  const [consolidatedMessage, setConsolidatedMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const consolidateMutation = useMutation({
    mutationFn: async () => {
      const vibesData = vibes.map(v => ({
        content: v.content,
        emoji: v.emoji || undefined,
      }));
      
      const response = await apiRequest("POST", api.ai.consolidate.path, { vibes: vibesData });
      return response.json();
    },
    onSuccess: (data) => {
      setConsolidatedMessage(data.message);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível consolidar os vibes. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setConsolidatedMessage("");
      setCopied(false);
      consolidateMutation.mutate();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(consolidatedMessage);
    setCopied(true);
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="lg" 
          className="rounded-full h-14 px-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg font-display gap-2 bg-background/90 backdrop-blur-sm border-2"
          data-testid="button-write"
        >
          <PenLine className="w-5 h-5" />
          Write
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-0 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center flex items-center justify-center gap-2">
            Mensagem Consolidada <span className="text-3xl">✨</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground text-center">
            A IA consolidou {vibes.length} vibe{vibes.length !== 1 ? 's' : ''} em uma mensagem única:
          </p>

          {consolidateMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground font-display animate-pulse">
                Consolidando vibes...
              </p>
            </div>
          ) : (
            <>
              <Textarea
                value={consolidatedMessage}
                onChange={(e) => setConsolidatedMessage(e.target.value)}
                className="min-h-[200px] rounded-2xl text-base bg-slate-50 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                placeholder="A mensagem consolidada aparecerá aqui..."
                data-testid="textarea-consolidated-message"
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                  onClick={() => consolidateMutation.mutate()}
                  disabled={consolidateMutation.isPending}
                  data-testid="button-regenerate"
                >
                  Gerar novamente
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl gap-2"
                  onClick={handleCopy}
                  disabled={!consolidatedMessage}
                  data-testid="button-copy-message"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
