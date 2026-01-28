import { db } from "./db";
import {
  vibes,
  type CreateVibeRequest,
  type UpdateVibeRequest,
  type Vibe
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getVibes(): Promise<Vibe[]>;
  createVibe(vibe: CreateVibeRequest): Promise<Vibe>;
  updateVibe(id: number, updates: UpdateVibeRequest): Promise<Vibe>;
  deleteVibe(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getVibes(): Promise<Vibe[]> {
    return await db.select().from(vibes);
  }

  async createVibe(vibe: CreateVibeRequest): Promise<Vibe> {
    const [newVibe] = await db.insert(vibes).values(vibe).returning();
    return newVibe;
  }

  async updateVibe(id: number, updates: UpdateVibeRequest): Promise<Vibe> {
    const [updated] = await db.update(vibes)
      .set(updates)
      .where(eq(vibes.id, id))
      .returning();
    return updated;
  }

  async deleteVibe(id: number): Promise<void> {
    await db.delete(vibes).where(eq(vibes.id, id));
  }
}

export const storage = new DatabaseStorage();
