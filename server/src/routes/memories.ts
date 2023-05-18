import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "asc"
      }
    });

    return memories.map(memory => {
      return {
        id: memory.id,
        mediaUrl: memory.mediaUrl,
        except: memory.text.substring(0, 115).concat("...")
      };
    });
  });

  app.get("/memories/:id", async (req: FastifyRequest) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = paramsSchema.parse(req.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    });

    return memory;
  });

  app.post("/memories", async (req: FastifyRequest, res: FastifyReply) => {
    const bodySchema = z.object({
      text: z.string(),
      mediaUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    });

    const { text, mediaUrl, isPublic } = bodySchema.parse(req.body);

    const memory = await prisma.memory.create({
      data: {
        text,
        mediaUrl,
        isPublic,
        userId: "57eecb7f-0830-476d-a747-f9a256164457"
      }
    });

    return memory;
  });

  app.put("/memories/:id", async (req: FastifyRequest) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = paramsSchema.parse(req.params);

    const bodySchema = z.object({
      text: z.string(),
      mediaUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    });

    const { text, mediaUrl, isPublic } = bodySchema.parse(req.body);

    const memory = await prisma.memory.update({
      where: {
        id
      },
      data: {
        text,
        mediaUrl,
        isPublic
      }
    });

    return memory;
  });

  app.delete("/memories/:id", async (req: FastifyRequest) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = paramsSchema.parse(req.params);

    await prisma.memory.delete({
      where: {
        id
      }
    });
  });
}
