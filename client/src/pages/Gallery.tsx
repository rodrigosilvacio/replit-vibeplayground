import { useVibes } from "@/hooks/use-vibes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export default function Gallery() {
  const { data: vibes, isLoading, isError } = useVibes();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", buildUrl(api.vibes.delete.path, { id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.vibes.list.path] });
      toast({
        title: "Vibe deleted",
        description: "The vibe has been removed from the playground.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Failed to load vibes</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Vibe Gallery
            </h1>
            <p className="text-muted-foreground mt-1">All your vibes in one place</p>
          </div>
        </div>

        {vibes?.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🎨</span>
            <p className="text-xl text-muted-foreground">No vibes yet. Go create some!</p>
            <Link href="/">
              <Button className="mt-4" data-testid="button-go-create">
                Go to Playground
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vibes?.map((vibe) => (
              <Card 
                key={vibe.id} 
                className={`${vibe.color} text-white overflow-hidden group`}
                data-testid={`card-vibe-${vibe.id}`}
              >
                <CardContent className="p-6 relative">
                  {vibe.emoji && (
                    <span className="text-4xl mb-3 block">{vibe.emoji}</span>
                  )}
                  <p className="text-lg font-medium leading-relaxed">{vibe.content}</p>
                  <div className="mt-4 text-sm opacity-70">
                    {vibe.createdAt && new Date(vibe.createdAt).toLocaleDateString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
                    onClick={() => deleteMutation.mutate(vibe.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-vibe-${vibe.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
