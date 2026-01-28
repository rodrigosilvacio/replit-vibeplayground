import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.vibes.list.path, async (req, res) => {
    const vibes = await storage.getVibes();
    res.json(vibes);
  });

  app.post(api.vibes.create.path, async (req, res) => {
    try {
      const input = api.vibes.create.input.parse(req.body);
      const vibe = await storage.createVibe(input);
      res.status(201).json(vibe);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.vibes.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.vibes.update.input.parse(req.body);
      const vibe = await storage.updateVibe(id, input);
      if (!vibe) {
        return res.status(404).json({ message: "Vibe not found" });
      }
      res.json(vibe);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.vibes.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteVibe(id);
    res.status(204).send();
  });

  // Seed data
  const existingVibes = await storage.getVibes();
  if (existingVibes.length === 0) {
    await storage.createVibe({ content: "Coding all night! 🚀", color: "bg-purple-500", emoji: "💻", x: 100, y: 100, rotation: -5 });
    await storage.createVibe({ content: "Need coffee... ☕", color: "bg-amber-500", emoji: "☕", x: 300, y: 200, rotation: 3 });
    await storage.createVibe({ content: "Vibing to lofi beats 🎧", color: "bg-blue-400", emoji: "🎧", x: 500, y: 150, rotation: 10 });
    await storage.createVibe({ content: "It works! 🎉", color: "bg-green-500", emoji: "🎉", x: 200, y: 400, rotation: -2 });
  }

  return httpServer;
}
