import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import axios from "axios";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (req: FastifyRequest) => {
    const bodySchema = z.object({
      code: z.string()
    });

    // Recebendo o code gerado da API do GitHub quando o usuário clica no link de criar conta do front-end, e o mesmo será exibido na URL
    const { code } = bodySchema.parse(req.body);

    // Transformando o code gerado em access token para identificar as informações do usuário logado no Github
    const accesstokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token", null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        },
        headers: {
          Accept: "application/json"
        }
      });

    const { access_token } = accesstokenResponse.data;

    // Setando o access token no header da requisição
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url()
    });

    const userInfo = userSchema.parse(userResponse.data);

    // Verificando se o usuário já está cadastrado no banco de dados
    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id
      }
    });

    // Salvando usuário no banco de dados
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url
        }
      });
    }

    // Gerando token JWT que deve ser o mesmo token que será utilizado nas próximas requisições do front-end para back-end
    const token = app.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl
    }, {
      sub: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN as string
    });

    return {
      token
    };
  });
}
