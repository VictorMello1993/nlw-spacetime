import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { memoriesRoutes } from "./routes/memories";
import "dotenv/config";
import { authRoutes } from "./routes/auth";
import { uploadRoutes } from "./routes/upload";
import { resolve } from "node:path";

const app = fastify();

app.register(multipart);

// Expondo a url do arquivo de upload ao navegador
app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads"
});

app.register(cors, {
  origin: true
});

app.register(jwt, {
  secret: process.env.JWT_SECRET as string
});

app.register(authRoutes);
app.register(memoriesRoutes);
app.register(uploadRoutes);

app.listen({
  port: 3333,
  host: "::"
}).then(() => console.log("🚀 Server is running..."));
