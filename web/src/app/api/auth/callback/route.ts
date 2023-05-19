import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const registerResponse = await api.post("/register", {
    code
  });

  const { token } = registerResponse.data;

  const redirectURL = new URL("/", req.url);

  const cookieExpiresInSeconds = 60 * 60 * 24 * 30; // 1 mês (em segundos)

  return NextResponse.redirect(redirectURL, {
    headers: {
      "Set-Cookie": `token=${token}; Path=/; max-age=${cookieExpiresInSeconds};`
    }
  });
}
