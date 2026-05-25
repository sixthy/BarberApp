"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type BlacklistEntry = {
  _id: string; customerName: string; customerEmail: string; customerPhone: string;
  noShowCount: number; isBlocked: boolean; blockedUntil?: string; lastNoShowAt?: string; reason: string;
};
type AdminUser = { id: string; name: string; email: string; role: string };

export default function BlacklistPage() {
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  async function loadBlacklist(t: string) {
    const data = await apiFetch<BlacklistEntry[]>("/blacklist", { token: t });
    setEntries(data);
  }

  async function handleUnblock(id: string) {
    if (!token) return;
    try {
      await apiFetch(`/blacklist/${id}/unblock`, { method: "PATCH", token });
      setMessage("Cliente desbloqueado.");
      await loadBlacklist(token);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Erro."); }
  }

  async function handleRemove(id: string) {
    if (!token) return;
    if (!confirm("Remover este cliente da blacklist?")) return;
    try {
      await apiFetch(`/blacklist/${id}`, { method: "DELETE", token });
      setMessage("Cliente removido.");
      await loadBlacklist(token);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Erro."); }
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }

  useEffect(() => {
    async function checkAdmin() {
      const savedToken = localStorage.getItem("accessToken");
      if (!savedToken) { setMessage("Faça login como admin."); return; }
      setToken(savedToken);
      try {
        const user = await apiFetch<AdminUser>("/auth/me", { token: savedToken });
        setAdminUser(user);
        if (user.role !== "admin") { setMessage("Acesso negado."); return; }
        setIsAdmin(true);
        await loadBlacklist(savedToken);
      } catch (e) { setMessage(e instanceof Error ? e.message : "Erro."); }
    }
    checkAdmin();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-white/10 bg-black md:flex">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Dashboard</p>
          {adminUser && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300/20 text-amber-300 font-bold text-sm flex-shrink-0">
                {adminUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{adminUser.name}</p>
              </div>
            </div>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="/admin" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <span>📋</span> Agendamentos
          </a>
          <a href="/admin/blacklist" className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
            <span>🚫</span> Blacklist
          </a>
          <a href="/admin/blocks" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <span>🔒</span> Fechamentos
          </a>
          <a href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <span>🏠</span> Site
          </a>
        </nav>
        <div className="p-4">
          <button type="button" onClick={handleLogout}
            className="w-full rounded-xl border border-red-500/30 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white transition-colors">
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between border-b border-white/10 bg-black px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-zinc-400 hover:text-white text-sm">← Voltar</a>
            <h1 className="text-lg font-bold">Blacklist</h1>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {message && (
            <div className="mb-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-sm text-zinc-300 text-center">{message}</div>
          )}

          {!isAdmin ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center text-zinc-400">Aguardando validação...</div>
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
                <div className="grid grid-cols-[1fr_1.5fr_1fr_0.5fr_0.8fr_1fr_1fr] border-b border-white/10 bg-zinc-900 px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <span>Cliente</span><span>Email</span><span>Telefone</span>
                  <span>Faltas</span><span>Status</span><span>Bloqueado até</span><span>Ações</span>
                </div>
                {entries.length === 0 ? (
                  <p className="p-8 text-center text-zinc-500">Nenhum cliente na blacklist.</p>
                ) : entries.map((entry) => (
                  <div key={entry._id}
                    className="grid grid-cols-[1fr_1.5fr_1fr_0.5fr_0.8fr_1fr_1fr] items-center gap-3 border-b border-white/5 px-5 py-4 text-sm">
                    <div>
                      <p className="font-semibold">{entry.customerName}</p>
                      <p className="text-xs text-zinc-500">{entry.reason || "—"}</p>
                    </div>
                    <div className="text-zinc-400 text-xs truncate">{entry.customerEmail}</div>
                    <div className="text-zinc-300">{entry.customerPhone}</div>
                    <div className="font-bold text-orange-300">{entry.noShowCount}</div>
                    <div>
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${entry.isBlocked ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                        {entry.isBlocked ? "Bloqueado" : "Liberado"}
                      </span>
                    </div>
                    <div className="text-zinc-400 text-xs">
                      {entry.blockedUntil ? new Date(entry.blockedUntil).toLocaleDateString("pt-PT") : "—"}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {entry.isBlocked && (
                        <button type="button" onClick={() => handleUnblock(entry._id)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold hover:bg-white hover:text-black transition-colors">
                          Desbloquear
                        </button>
                      )}
                      <button type="button" onClick={() => handleRemove(entry._id)}
                        className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500 hover:text-white transition-colors">
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 md:hidden">
                {entries.length === 0 ? (
                  <p className="rounded-2xl border border-white/10 p-8 text-center text-zinc-500">Nenhum cliente na blacklist.</p>
                ) : entries.map((entry) => (
                  <div key={entry._id} className="rounded-2xl border border-white/10 bg-zinc-900 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold">{entry.customerName}</p>
                        <p className="text-xs text-zinc-500">{entry.customerEmail}</p>
                        <p className="text-xs text-zinc-500">{entry.customerPhone}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold flex-shrink-0 ${entry.isBlocked ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                        {entry.isBlocked ? "Bloqueado" : "Liberado"}
                      </span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <div className="flex-1 rounded-xl bg-black p-3">
                        <p className="text-xs text-zinc-500">Faltas</p>
                        <p className="mt-1 font-bold text-orange-300">{entry.noShowCount}</p>
                      </div>
                      <div className="flex-1 rounded-xl bg-black p-3">
                        <p className="text-xs text-zinc-500">Bloqueado até</p>
                        <p className="mt-1 text-xs font-medium">
                          {entry.blockedUntil ? new Date(entry.blockedUntil).toLocaleDateString("pt-PT") : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {entry.isBlocked && (
                        <button type="button" onClick={() => handleUnblock(entry._id)}
                          className="flex-1 rounded-xl bg-white/5 py-2.5 text-sm font-bold hover:bg-white hover:text-black transition-colors">
                          Desbloquear
                        </button>
                      )}
                      <button type="button" onClick={() => handleRemove(entry._id)}
                        className="flex-1 rounded-xl bg-red-500/10 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white transition-colors">
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}