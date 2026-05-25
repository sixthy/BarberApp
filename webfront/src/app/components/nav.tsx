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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("accessToken");
      if (!token) { setLoadingUser(false); return; }
      try {
        const data = await apiFetch<AuthUser>("/auth/me", { token });
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

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const header = document.getElementById("main-header");
      if (header && !header.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  function handleUserArea() {
    setMenuOpen(false);
    if (!user) { router.push("/login"); return; }
    router.push(user.role === "admin" ? "/admin" : "/agendar");
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header id="main-header" className="relative z-50 w-full border-b border-white/10 bg-black">
      <div className="relative hidden h-24 w-full px-8 text-white md:block">
        <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-16">
          <a href="#nav" className="text-sm font-semibold hover:text-zinc-400 transition-colors">INICIO</a>
          <a href="#services" className="text-sm font-semibold hover:text-zinc-400 transition-colors">SERVIÇOS</a>
          <div className="w-24" />
          <a href="/login" className="text-sm font-semibold hover:text-zinc-400 transition-colors">AGENDAR</a>
          <a href="#contact" className="text-sm font-semibold hover:text-zinc-400 transition-colors">CONTATO</a>
        </nav>

        <a href="#nav" className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <Image src="/logobarb.jpg" alt="barb logo" width={80} height={80} priority
            className="rounded-full border border-white/30" />
        </a>

        <div className="absolute right-8 top-1/2 z-30 flex -translate-y-1/2 items-center gap-3">
          {loadingUser ? (
            <span className="text-sm text-zinc-500">...</span>
          ) : user ? (
            <>
              <button type="button" onClick={handleUserArea}
                className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:bg-zinc-300 transition-colors">
                {user.role === "admin" ? "DASHBOARD" : "AGENDAR"}
              </button>
              <button type="button" onClick={handleLogout}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors">
                SAIR
              </button>
            </>
          ) : (
            <>
              <a href="/login"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors">
                LOGIN
              </a>
              <a href="/register"
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-300 transition-colors">
                CADASTRE-SE
              </a>
            </>
          )}
        </div>
      </div>

      
      <div className="flex h-16 items-center justify-between px-4 md:hidden">
        <a href="#nav">
          <Image src="/logobarb.jpg" alt="barb logo" width={48} height={48} priority
            className="rounded-full border border-white/30" />
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex flex-col justify-center gap-[5px] p-2 text-white"
          aria-label="Menu"
        >
          <span className="block h-[1.5px] w-5 bg-white transition-all duration-200"
            style={{ transform: menuOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span className="block h-[1.5px] w-5 bg-white transition-all duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block h-[1.5px] w-5 bg-white transition-all duration-200"
            style={{ transform: menuOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2 text-white">
            <a href="#nav" onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              INICIO
            </a>
            <a href="#services" onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              SERVIÇOS
            </a>
            <a href="/login" onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              AGENDAR
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              CONTATO
            </a>

            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
              {loadingUser ? null : user ? (
                <>
                  <button type="button" onClick={handleUserArea}
                    className="w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-zinc-300">
                    {user.role === "admin" ? "DASHBOARD" : "AGENDAR"}
                  </button>
                  <button type="button" onClick={handleLogout}
                    className="w-full rounded-xl border border-red-500/30 py-3 text-sm font-bold text-red-200 hover:bg-red-500 hover:text-white">
                    SAIR
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-xl border border-white/20 py-3 text-center text-sm font-bold hover:bg-white hover:text-black">
                    LOGIN
                  </a>
                  <a href="/register" onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-black hover:bg-zinc-300">
                    CADASTRE-SE
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}