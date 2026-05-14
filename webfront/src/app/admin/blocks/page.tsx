"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type ScheduleBlock = {
  _id: string;
  date: string;
  type: "day" | "time";
  startTime?: string;
  endTime?: string;
  reason: string;
  isActive: boolean;
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

  async function loadBlocks(currentToken: string) {
    const data = await apiFetch<ScheduleBlock[]>("/schedule-blocks", {
      token: currentToken,
    });

    setBlocks(data);
  }

  async function handleCreateBlock() {
    if (!token) return;

    setMessage("");

    try {
      await apiFetch("/schedule-blocks", {
        method: "POST",
        token,
        body: JSON.stringify({
          date,
          type,
          startTime: type === "time" ? startTime : undefined,
          endTime: type === "time" ? endTime : undefined,
          reason,
        }),
      });

      setMessage("Bloqueio criado com sucesso.");
      setReason("");
      await loadBlocks(token);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro ao criar bloqueio."
      );
    }
  }

  async function handleReopen(id: string) {
    if (!token) return;

    setMessage("");

    try {
      await apiFetch(`/schedule-blocks/${id}/reopen`, {
        method: "PATCH",
        token,
      });

      setMessage("Horário/data reaberto com sucesso.");
      await loadBlocks(token);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro ao reabrir."
      );
    }
  }

  useEffect(() => {
    async function start() {
      const savedToken = localStorage.getItem("accessToken");

      if (!savedToken) {
        setMessage("Faça login como admin.");
        return;
      }

      setToken(savedToken);

      const user = await apiFetch<{ role: string }>("/auth/me", {
        token: savedToken,
      });

      if (user.role !== "admin") {
        setMessage("Acesso negado.");
        return;
      }

      await loadBlocks(savedToken);
    }

    start();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              Bloqueios de Agenda
            </h1>

            <p className="mt-3 text-zinc-400">
              Feche um dia inteiro ou bloqueie horários específicos.
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white hover:text-black"
          >
            VOLTAR
          </a>
        </div>

        {message && (
          <p className="mb-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-center text-sm text-zinc-300">
            {message}
          </p>
        )}

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">
            Novo bloqueio
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
            />

            <select
              value={type}
              onChange={(event) => setType(event.target.value as "day" | "time")}
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
            >
              <option value="day">Dia inteiro</option>
              <option value="time">Horário</option>
              
            </select>

            {type === "time" && (
              <>
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
                />

                <input
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
                />
              </>
            )}

            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Motivo"
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleCreateBlock}
            className="mt-6 rounded-xl bg-amber-200 px-6 py-4 font-bold text-black hover:bg-amber-400"
          >
            BLOQUEAR
          </button>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
          <div className="grid grid-cols-6 border-b border-white/10 bg-zinc-900 px-5 py-4 text-sm font-bold text-zinc-300">
            <span>Data</span>
            <span>Tipo</span>
            <span>Início</span>
            <span>Fim</span>
            <span>Status</span>
            <span>Ação</span>
          </div>

          {blocks.map((block) => (
            <div
              key={block._id}
              className="grid grid-cols-6 items-center border-b border-white/10 px-5 py-4 text-sm"
            >
              <span>{block.date}</span>
              <span>{block.type === "day" ? "Dia inteiro" : "Horário"}</span>
              <span>{block.startTime || "-"}</span>
              <span>{block.endTime || "-"}</span>
              <span>{block.isActive ? "Bloqueado" : "Reaberto"}</span>

              <span>
                {block.isActive ? (
                  <button
                    type="button"
                    onClick={() => handleReopen(block._id)}
                    className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white hover:text-black"
                  >
                    Reabrir
                  </button>
                ) : (
                  <span className="text-zinc-500">Sem ação</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}