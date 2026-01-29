import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

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

  // AI consolidation endpoint
  app.post(api.ai.consolidate.path, async (req, res) => {
    try {
      const input = api.ai.consolidate.input.parse(req.body);
      
      if (input.vibes.length === 0) {
        return res.json({ message: "Nenhum vibe para consolidar. Adicione alguns vibes primeiro!" });
      }

      const vibesText = input.vibes
        .map((v, i) => `${i + 1}. ${v.emoji || ''} "${v.content}"`)
        .join('\n');

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um assistente criativo que consolida mensagens e vibes em uma única mensagem inspiradora e coesa. Responda em português brasileiro. Seja breve mas impactante."
          },
          {
            role: "user",
            content: `Consolide esses vibes/recados em uma única mensagem que capture a essência de todos:\n\n${vibesText}`
          }
        ],
        max_tokens: 500,
      });

      const message = response.choices[0]?.message?.content || "Não foi possível gerar uma mensagem.";
      
      res.json({ message });
    } catch (err) {
      console.error("Error consolidating vibes:", err);
      res.status(500).json({ message: "Erro ao consolidar os vibes." });
    }
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
