import { ReactNode } from "react";
import "./globals.css";
import { Roboto_Flex as Roboto, Bai_Jamjuree as BaiJamjuree } from "next/font/google";
import { Profile } from "../components/Profile";
import Signin from "../components/Signin";
import { Slogan } from "../components/Slogan";
import { Copyright } from "../components/Copyright";
import { cookies } from "next/headers";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const baiJamjuree = BaiJamjuree({ subsets: ["latin"], weight: "700", variable: "--font-bai-jamjuree" });

export const metadata = {
  title: "NLW Spacetime",
  description: "Uma cápsula do tempo construída com React, Next.js, TailwindCSS e Typescript"
};

export default function RootLayout({ children }: {children: ReactNode}) {
  const isAuthenticated = cookies().has("token");
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${baiJamjuree.variable} font-sans text-gray-100 bg-gray-900`}>
        <main className="grid min-h-screen grid-cols-2">
      {/* esquerda */}
      <div className="bg-coverflex relative flex flex-col items-start justify-between overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] px-28 py-16">

        {/* Blur */}
        <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full" />

        {/* Stripes */}
        <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes" />

        {isAuthenticated ? <Profile/> : <Signin/>}
        <Slogan/>
        <Copyright/>
      </div>

      {/* direita */}
      <div className="flex max-h-screen overflow-y-scroll flex-col bg-[url(../assets/bg-stars.svg)] bg-cover">
        {children}
      </div>
      </main>
    </body>
  </html>
  );
}
