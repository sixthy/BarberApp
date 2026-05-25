"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type ScheduleBlock = {
  _id: string; date: string; type: "day" | "time";
  startTime?: string; endTime?: string; reason: string; isActive: boolean;
};

export default function BlocksPage() {
  const [token, setToken] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"day" | "time">("day");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [reason, setReason] = useState("");

  async function loadBlocks(t: string) {
    const data = await apiFetch<ScheduleBlock[]>("/schedule-blocks", { token: t });
    setBlocks(data);
  }

  async function handleCreateBlock() {
    if (!token) return;
    setMessage("");
    try {
      await apiFetch("/schedule-blocks", {
        method: "POST", token,
        body: JSON.stringify({
          date, type,
          startTime: type === "time" ? startTime : undefined,
          endTime: type === "time" ? endTime : undefined,
          reason,
        }),
      });
      setMessage("Bloqueio criado com sucesso.");
      setReason("");
      await loadBlocks(token);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Erro."); }
  }

  async function handleReopen(id: string) {
    if (!token) return;
    try {
      await apiFetch(`/schedule-blocks/${id}/reopen`, { method: "PATCH", token });
      setMessage("Reaberto com sucesso.");
      await loadBlocks(token);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Erro."); }
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }

  useEffect(() => {
    async function start() {
      const savedToken = localStorage.getItem("accessToken");
      if (!savedToken) { setMessage("Faça login como admin."); return; }
      setToken(savedToken);
      const user = await apiFetch<{ role: string }>("/auth/me", { token: savedToken });
      if (user.role !== "admin") { setMessage("Acesso negado."); return; }
      await loadBlocks(savedToken);
    }
    start();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-white/10 bg-black md:flex">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="/admin" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <span>📋</span> Agendamentos
          </a>
          <a href="/admin/blacklist" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <span>🚫</span> Blacklist
          </a>
          <a href="/admin/blocks" className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
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
        <div className="flex items-center gap-3 border-b border-white/10 bg-black px-4 py-3 md:px-8">
          <a href="/admin" className="text-zinc-400 hover:text-white text-sm">← Voltar</a>
          <h1 className="text-lg font-bold">Bloqueios de Agenda</h1>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {message && (
            <div className="mb-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-sm text-zinc-300 text-center">{message}</div>
          )}

          <div className="mb-8 rounded-2xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="mb-5 text-base font-bold">Novo bloqueio</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Data</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm outline-none focus:border-amber-300 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value as "day" | "time")}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm outline-none focus:border-amber-300 transition-colors">
                  <option value="day">Dia inteiro</option>
                  <option value="time">Horário específico</option>
                </select>
              </div>
              {type === "time" && (
                <>
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Início</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm outline-none focus:border-amber-300 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Fim</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm outline-none focus:border-amber-300 transition-colors" />
                  </div>
                </>
              )}
              <div className={type === "time" ? "sm:col-span-2 lg:col-span-4" : ""}>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Motivo</label>
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex: Feriado, viagem..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm outline-none focus:border-amber-300 transition-colors" />
              </div>
            </div>
            <button type="button" onClick={handleCreateBlock}
              className="mt-5 rounded-xl bg-amber-300 px-8 py-3 font-bold text-black hover:bg-amber-400 transition-colors">
              BLOQUEAR
            </button>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
            <div className="grid grid-cols-6 border-b border-white/10 bg-zinc-900 px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <span>Data</span><span>Tipo</span><span>Início</span><span>Fim</span><span>Status</span><span>Ação</span>
            </div>
            {blocks.length === 0 ? (
              <p className="p-8 text-center text-zinc-500">Nenhum bloqueio registado.</p>
            ) : blocks.map((block) => (
              <div key={block._id} className="grid grid-cols-6 items-center border-b border-white/5 px-5 py-4 text-sm">
                <span className="font-medium">{block.date}</span>
                <span className="text-zinc-300">{block.type === "day" ? "Dia inteiro" : "Horário"}</span>
                <span className="text-zinc-400">{block.startTime || "—"}</span>
                <span className="text-zinc-400">{block.endTime || "—"}</span>
                <span>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${block.isActive ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                    {block.isActive ? "Bloqueado" : "Reaberto"}
                  </span>
                </span>
                <span>
                  {block.isActive ? (
                    <button type="button" onClick={() => handleReopen(block._id)}
                      className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold hover:bg-white hover:text-black transition-colors">
                      Reabrir
                    </button>
                  ) : <span className="text-zinc-600 text-xs">—</span>}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 md:hidden">
            {blocks.length === 0 ? (
              <p className="rounded-2xl border border-white/10 p-8 text-center text-zinc-500">Nenhum bloqueio.</p>
            ) : blocks.map((block) => (
              <div key={block._id} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold">{block.date}</p>
                    <p className="text-xs text-zinc-400">{block.type === "day" ? "Dia inteiro" : `${block.startTime} – ${block.endTime}`}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${block.isActive ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                    {block.isActive ? "Bloqueado" : "Reaberto"}
                  </span>
                </div>
                {block.isActive && (
                  <button type="button" onClick={() => handleReopen(block._id)}
                    className="w-full rounded-xl bg-white/5 py-2.5 text-sm font-bold hover:bg-white hover:text-black transition-colors">
                    Reabrir
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}