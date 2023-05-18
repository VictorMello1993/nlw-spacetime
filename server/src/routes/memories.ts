import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  /* Incluído a verificação do token válido para todas as rotas de memories,
  de forma que só serão acessadas quando o usuário estiver autenticado */
  app.addHook("preHandler", async(req: FastifyRequest) => {
    await req.jwtVerify();
  });

  app.get("/memories", async (req: FastifyRequest) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: req.user.sub
      },
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

  app.get("/memories/:id", async (req: FastifyRequest, res: FastifyReply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = paramsSchema.parse(req.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    });

    // Se o usuário não é público e não for o mesmo usuário que está acessando a essa rota, não permitir retornar a memória
    if (!memory.isPublic && memory.userId !== req.user.sub) {
      return res.status(401).send();
    }

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
        userId: req.user.sub
      }
    });

    return memory;
  });

  app.put("/memories/:id", async (req: FastifyRequest, res: FastifyReply) => {
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

    let memory = await prisma.memory.findUniqueOrThrow({
      where: { id }
    });

    // Se o usuário não for o mesmo usuário que está acessando a essa rota, não permitir retornar a memória
    if (memory.userId !== req.user.sub) {
      return res.status(401).send();
    }

    memory = await prisma.memory.update({
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

  app.delete("/memories/:id", async (req: FastifyRequest, res: FastifyReply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = paramsSchema.parse(req.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id }
    });

    // Se o usuário não for o mesmo usuário que está acessando a essa rota, não permitir retornar a memória
    if (memory.userId !== req.user.sub) {
      return res.status(401).send();
    }

    await prisma.memory.delete({
      where: {
        id
      }
    });
  });
}
