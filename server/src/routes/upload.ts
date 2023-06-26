import { FastifyInstance, FastifyReply } from "fastify";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { extname, resolve } from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import fs from "fs";
import path from "path";

const FIVE_MB_FILE_SIZE = 5_242_880; // 5Mb
const IMAGE_OR_VIDEO_MIMETYPE_REGEX = /^(image|video)\/[a-zA-Z]+/;
const UPLOAD_FOLDER = path.join(__dirname, "..", "..", "uploads");

const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (req, res: FastifyReply) => {
    const upload = await req.file({
      limits: {
        fileSize: FIVE_MB_FILE_SIZE
      }
    });

    if (!upload) {
      return res.status(400).send();
    }

    const isValidFileFormat = IMAGE_OR_VIDEO_MIMETYPE_REGEX.test(upload.mimetype);

    if (!isValidFileFormat) {
      return res.status(400).send();
    }

    const fileId = randomUUID();
    const fileExtension = extname(upload.filename);

    const fileName = fileId.concat(fileExtension);

    if (!fs.existsSync(UPLOAD_FOLDER)) {
      fs.mkdirSync(UPLOAD_FOLDER);
    }

    // Salvando arquivo em disco para pasta uploads, de maneira assíncrona com uso de streaming de dados
    // OBS: não utilizar essa abordagem quando a aplicação estiver rodando em produção!
    // Em vez disso, utilizar vários serviços que permitem armazenamento de arquivos estáticos (ex: AWS S3, Google GCS, Cloudflare)
    const writeStream = createWriteStream(
      resolve(__dirname, "../../uploads/", fileName)
    );

    await pump(upload.file, writeStream);

    // Equivalente a qualquer protocolo de aplicação (se for HTTP, será do tipo 'http://hostname')
    const fullUrl = req.protocol.concat("://").concat(req.hostname);

    // Obtendo a url final do arquivo a ser enviado para o front-end
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();

    return { fileUrl };
  });
}
