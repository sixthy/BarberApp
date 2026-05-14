"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type BlacklistEntry = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  noShowCount: number;
  isBlocked: boolean;
  blockedUntil?: string;
  lastNoShowAt?: string;
  reason: string;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function BlacklistPage() {
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  async function loadBlacklist(currentToken: string) {
    const data = await apiFetch<BlacklistEntry[]>("/blacklist", {
      token: currentToken,
    });

    setEntries(data);
  }

  async function handleUnblock(id: string) {
    if (!token) return;

    setMessage("");

    try {
      await apiFetch(`/blacklist/${id}/unblock`, {
        method: "PATCH",
        token,
      });

      setMessage("Cliente desbloqueado com sucesso.");
      await loadBlacklist(token);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro ao desbloquear cliente."
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }

  async function handleRemove(id: string) {
    if (!token) return;

    const confirmRemove = confirm(
      "Tem certeza que deseja remover este cliente da blacklist?"
    );

    if (!confirmRemove) return;

    setMessage("");

    try {
      await apiFetch(`/blacklist/${id}`, {
        method: "DELETE",
        token,
      });

      setMessage("Cliente removido da blacklist.");
      await loadBlacklist(token);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro ao remover cliente."
      );
    }
  }

  useEffect(() => {
    async function checkAdmin() {
      const savedToken = localStorage.getItem("accessToken");

      if (!savedToken) {
        setMessage("Faça login como admin para acessar esta página.");
        return;
      }

      setToken(savedToken);

      try {
        const user = await apiFetch<AdminUser>("/auth/me", {
          token: savedToken,
        });

        setAdminUser(user);

        if (user.role !== "admin") {
          setMessage("Acesso negado. Apenas admin pode acessar esta página.");
          return;
        }

        setIsAdmin(true);
        await loadBlacklist(savedToken);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Erro ao validar usuário."
        );
      }
    }

    checkAdmin();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Blacklist
            </h1>

            <p className="mt-3 text-zinc-400">
              Controle clientes com faltas e bloqueios.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            {adminUser && (
              <div className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-4">
                <p className="text-sm text-zinc-400">Admin logado</p>
                <p className="mt-1 font-bold">{adminUser.name}</p>
                <p className="text-sm text-zinc-500">{adminUser.email}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white hover:text-black"
              >
                AGENDAMENTOS
              </a>

              <a
                href="/"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white hover:text-black"
              >
                HOME
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-red-500/30 px-5 py-3 text-sm font-bold text-red-200 hover:bg-red-500 hover:text-white"
              >
                SAIR
              </button>
            </div>
          </div>
        </div>

        {message && (
          <p className="mb-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-center text-sm text-zinc-300">
            {message}
          </p>
        )}

        {!isAdmin ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8 text-center text-zinc-400">
            Aguardando validação de admin...
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
            <div className="grid grid-cols-7 border-b border-white/10 bg-zinc-900 px-5 py-4 text-sm font-bold text-zinc-300">
              <span>Cliente</span>
              <span>Email</span>
              <span>Telefone</span>
              <span>Faltas</span>
              <span>Status</span>
              <span>Bloqueado até</span>
              <span>Ações</span>
            </div>

            {entries.length === 0 ? (
              <p className="p-6 text-center text-zinc-500">
                Nenhum cliente na blacklist.
              </p>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry._id}
                  className="grid grid-cols-7 items-center gap-3 border-b border-white/10 px-5 py-4 text-sm"
                >
                  <div>
                    <p className="font-bold">{entry.customerName}</p>
                    <p className="text-xs text-zinc-500">
                      {entry.reason || "Sem motivo informado"}
                    </p>
                  </div>

                  <div className="text-zinc-300">
                    {entry.customerEmail}
                  </div>

                  <div className="text-zinc-300">
                    {entry.customerPhone}
                  </div>

                  <div>
                    {entry.noShowCount}
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${entry.isBlocked
                        ? "bg-red-500/20 text-red-200"
                        : "bg-green-500/20 text-green-200"
                        }`}
                    >
                      {entry.isBlocked ? "Bloqueado" : "Liberado"}
                    </span>
                  </div>

                  <div className="text-zinc-400">
                    {entry.blockedUntil
                      ? new Date(entry.blockedUntil).toLocaleDateString("pt-PT")
                      : "-"}
                  </div>

                  <div className="flex flex-col gap-2">
                    {entry.isBlocked && (
                      <button
                        type="button"
                        onClick={() => handleUnblock(entry._id)}
                        className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white hover:text-black"
                      >
                        Desbloquear
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(entry._id)}
                      className="rounded-lg bg-red-500/20 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500 hover:text-white"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}