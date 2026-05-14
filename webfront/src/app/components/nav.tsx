"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
};

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const data = await apiFetch<AuthUser>("/auth/me", {
          token,
        });

        setUser(data);
      } catch {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  function handleUserArea() {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "admin") {
      router.push("/admin");
      return;
    }

    router.push("/agendar");
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/");
  }

  return (
    <header className="relative z-50 w-full border-b border-white bg-black">
      <div className="relative h-24 w-full px-8 text-white">


        <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-20">
          <a
            href="#nav"
            className="font-semibold hover:text-zinc-400"
          >
            INICIO
          </a>

          <a
            href="#services"
            className="font-semibold hover:text-zinc-400"
          >
            SERVIÇOS
          </a>


          <div className="w-28" />

          <a
            href="/login"
            className="font-semibold hover:text-zinc-400"
          >
            AGENDAR
          </a>

          <a
            href="#contact"
            className="font-semibold hover:text-zinc-400"
          >
            CONTATO
          </a>
        </nav>


        <a
          href="#nav"
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <Image
            src="/logobarb.jpg"
            alt="barb logo"
            width={88}
            height={88}
            priority
            className="rounded-full border border-white"
          />
        </a>


        <div className="absolute right-8 top-1/2 z-30 flex -translate-y-1/2 items-center gap-3">
          {loadingUser ? (
            <span className="text-sm text-zinc-500">
              Carregando...
            </span>
          ) : user ? (
            <>
              <button
                type="button"
                onClick={handleUserArea}
                className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:bg-zinc-300"
              >
                {user.role === "admin" ? "DASHBOARD" : "AGENDAR"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
              >
                SAIR
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold hover:bg-white hover:text-black"
              >
                LOGIN
              </a>

              <a
                href="/register"
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-300"
              >
                CADASTRE-SE
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}