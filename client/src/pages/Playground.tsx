import { useRef } from "react";
import { useVibes } from "@/hooks/use-vibes";
import { VibeCard } from "@/components/VibeCard";
import { CreateVibeDialog } from "@/components/CreateVibeDialog";
import { Loader2 } from "lucide-react";

export default function Playground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: vibes, isLoading, isError } = useVibes();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-lg font-display text-muted-foreground animate-pulse">Loading vibes...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-4xl">😵‍💫</h1>
          <h2 className="text-2xl font-bold font-display text-destructive">Oops, vibes are off!</h2>
          <p className="text-muted-foreground">Couldn't connect to the vibe server. Try refreshing?</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-background bg-dots touch-none"
    >
      {/* Header / Brand */}
      <div className="absolute top-0 left-0 p-8 z-10 pointer-events-none select-none">
        <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary drop-shadow-sm">
          Vibe Playground
        </h1>
        <p className="text-lg md:text-xl font-hand text-muted-foreground mt-2 rotate-2 ml-4">
          Drag 'em, drop 'em, feel 'em!
        </p>
      </div>

      {/* Vibe Cards Layer */}
      <div className="w-full h-full relative">
        {vibes?.map((vibe) => (
          <VibeCard key={vibe.id} vibe={vibe} containerRef={containerRef} />
        ))}
        
        {vibes?.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
            <div className="text-center space-y-4">
              <span className="text-8xl">🦗</span>
              <p className="text-2xl font-display text-muted-foreground">It's quiet in here...</p>
              <p className="font-hand text-xl rotate-[-2deg] text-primary">Be the first to add a vibe!</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-8 right-8 z-20">
        <CreateVibeDialog />
      </div>
      
      {/* Subtle footer info */}
      <div className="absolute bottom-4 left-6 text-xs text-muted-foreground/50 font-mono pointer-events-none">
        {vibes?.length || 0} active vibes • Auto-syncing
      </div>
    </div>
  );
}
