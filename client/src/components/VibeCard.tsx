import { motion } from "framer-motion";
import { type Vibe } from "@shared/schema";
import { useUpdateVibe, useDeleteVibe } from "@/hooks/use-vibes";
import { X, GripVertical } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface VibeCardProps {
  vibe: Vibe;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function VibeCard({ vibe, containerRef }: VibeCardProps) {
  const { mutate: updateVibe } = useUpdateVibe();
  const { mutate: deleteVibe } = useDeleteVibe();
  const [isDragging, setIsDragging] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    
    // We need to calculate position relative to the container
    // This assumes the point is the offset from initial position
    // In a real app with absolute positioning, you'd calculate exact x/y
    // Here we'll just update the stored coordinates
    const newX = vibe.x + info.offset.x;
    const newY = vibe.y + info.offset.y;

    updateVibe({ id: vibe.id, x: newX, y: newY });
  };

  // Color mappings for visual flair
  const colorStyles: Record<string, string> = {
    "bg-yellow-200": "bg-yellow-200 text-yellow-900 border-yellow-400 shadow-yellow-200/50",
    "bg-pink-200": "bg-pink-200 text-pink-900 border-pink-400 shadow-pink-200/50",
    "bg-blue-200": "bg-blue-200 text-blue-900 border-blue-400 shadow-blue-200/50",
    "bg-green-200": "bg-green-200 text-green-900 border-green-400 shadow-green-200/50",
    "bg-purple-200": "bg-purple-200 text-purple-900 border-purple-400 shadow-purple-200/50",
    "bg-white": "bg-white text-gray-900 border-gray-200 shadow-gray-200/50",
  };

  const baseStyle = colorStyles[vibe.color] || colorStyles["bg-white"];

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={{ x: vibe.x, y: vibe.y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: vibe.x, 
        y: vibe.y, 
        opacity: 1, 
        scale: 1,
        rotate: vibe.rotation 
      }}
      whileHover={{ scale: 1.05, zIndex: 50, rotate: 0 }}
      whileDrag={{ scale: 1.1, zIndex: 100, rotate: 0, cursor: "grabbing" }}
      className={cn(
        "absolute w-64 p-6 rounded-3xl border-2 shadow-lg flex flex-col gap-3 backdrop-blur-sm select-none touch-none cursor-grab transition-colors",
        baseStyle
      )}
    >
      <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 left-2">
        <div className="p-1 rounded-full hover:bg-black/5">
            <GripVertical className="w-4 h-4 text-black/20" />
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            deleteVibe(vibe.id);
          }}
          className="p-1 rounded-full hover:bg-black/10 text-black/40 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="text-4xl mb-1">{vibe.emoji}</div>
      <p className="font-display text-xl leading-tight font-medium break-words">
        {vibe.content}
      </p>
      
      {/* Decorative tape effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/30 backdrop-blur-md rotate-2 border border-white/20 shadow-sm" />
    </motion.div>
  );
}
