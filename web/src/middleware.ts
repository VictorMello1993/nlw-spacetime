import { NextRequest, NextResponse } from "next/server";

const signInUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;

// Middleware de autenticação para interceptar todos os acessos aos caminhos da rota de memories
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  /* Se o usuário não está autenticado, será gerado um novo cookie com vida útil curto somente para redirecionar
     para a mesma rota de origem que está tentando acessar, em vez de redirecionar para a página inicial */
  if (!token) {
    return NextResponse.redirect(signInUrl, {
      headers: {
        "Set-Cookie": `redirectTo=${req.url}; Path=/; HttpOnly; max-age=20;`
      }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/memories/:path*"
};
