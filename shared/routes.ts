import { z } from 'zod';
import { insertVibeSchema, vibes } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  ai: {
    consolidate: {
      method: 'POST' as const,
      path: '/api/ai/consolidate',
      input: z.object({
        vibes: z.array(z.object({
          content: z.string(),
          emoji: z.string().optional(),
        })),
      }),
      responses: {
        200: z.object({
          message: z.string(),
        }),
        500: errorSchemas.internal,
      },
    },
  },
  vibes: {
    list: {
      method: 'GET' as const,
      path: '/api/vibes',
      responses: {
        200: z.array(z.custom<typeof vibes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/vibes',
      input: insertVibeSchema,
      responses: {
        201: z.custom<typeof vibes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/vibes/:id',
      input: insertVibeSchema.partial(),
      responses: {
        200: z.custom<typeof vibes.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/vibes/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
