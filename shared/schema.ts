import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vibes = pgTable("vibes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  color: text("color").notNull(), // css class or hex
  x: integer("x").notNull().default(0),
  y: integer("y").notNull().default(0),
  rotation: integer("rotation").notNull().default(0),
  emoji: text("emoji"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVibeSchema = createInsertSchema(vibes).omit({ 
  id: true, 
  createdAt: true 
});

export type Vibe = typeof vibes.$inferSelect;
export type InsertVibe = z.infer<typeof insertVibeSchema>;

export type CreateVibeRequest = InsertVibe;
export type UpdateVibeRequest = Partial<InsertVibe>;
