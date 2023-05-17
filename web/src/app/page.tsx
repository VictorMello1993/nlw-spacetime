import { User } from "lucide-react";
import Image from "next/image";
import logo from "../assets/nlw-spacetime-logo.svg";

export default function Home () {
  return (
    <main className="grid grid-cols-2 min-h-screen">
      {/* esquerda */}
      <div className="bg-[url(../assets/bg-stars.svg)] bg-coverflex flex-col items-start justify-between px-28 py-16 relative overflow-hidden border-r border-white/10">
        {/* Blur */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-[288px] w-[526px] bg-purple-700 opacity-50 rounded-full blur-full"/>

        {/* Stripes */}
        <div className="absolute right-2 top-0 bottom-0 w-2 bg-stripes"/>

        {/* Sign in */}
        <a href="" className="flex items-center gap-3 text-left hover:text-gray-50 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400">
            <User className="h-5 w-5 text-gray-500"/>
          </div>

          <p className="text-sm leading-snug max-w-[140px]"><span className="underline">Crie sua conta</span> e salve suas memórias!</p>
        </a>

        {/* Slogan */}
        <div className="space-y-5">
          <Image src={logo} alt="NLW Spacetime"/>
          <div>
            <h1>Sua cápsula do tempo</h1>
            <p>Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!</p>
          </div>
          <a href="">CADASTRAR LEMBRANÇA</a>
        </div>
      </div>

      {/* direita */}
      <div className="flex flex-col p-16 bg-[url(../assets/bg-stars.svg)] bg-cover">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center leading-relaxed w-[360px]">Você ainda não registrou nenhuma lembrança, comece a <a className="underline hover:text-gray-50" href="">criar agora</a>!</p>
        </div>
      </div>
    </main>
  );
}
