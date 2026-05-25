"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type AdminUser = { id: string; name: string; email: string; role: string };
type BarberService = { _id: string; name: string; price: number; durationInMinutes: number; isActive: boolean };
type Booking = {
  _id: string; customerName: string; customerEmail: string; customerPhone: string;
  serviceNames: string[]; serviceIds: string[]; totalPrice: number;
  totalDurationInMinutes: number; date: string; startTime: string; endTime: string; status: string;
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-300 border border-red-500/30",
  no_show: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  pending: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmado", cancelled: "Cancelado", no_show: "Falta", pending: "Pendente",
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [services, setServices] = useState<BarberService[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editServiceIds, setEditServiceIds] = useState<string[]>([]);
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function loadServices(t: string) {
    const data = await apiFetch<BarberService[]>("/services/active", { token: t });
    setServices(data);
  }

  async function loadBookings(t: string) {
    const data = await apiFetch<Booking[]>("/bookings", { token: t });
    setBookings(data);
  }

  async function handleCancel(id: string) {
    if (!token) return;
    try {
      await apiFetch(`/bookings/${id}/cancel`, { method: "PATCH", token });
      setMessage("Agendamento cancelado.");
      await loadBookings(token);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Erro ao cancelar."); }
  }

  async function handleNoShow(id: string) {
    if (!token) return;
    try {
      await apiFetch(`/bookings/${id}/no-show`, { method: "PATCH", token });
      setMessage("Falta registrada.");
      await loadBookings(token);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Erro ao marcar falta."); }
  }

  function openEditModal(booking: Booking) {
    setEditingBooking(booking);
    setEditServiceIds(booking.serviceIds.map(String));
    setEditDate(booking.date);
    setEditStartTime(booking.startTime);
    setEditPhone(booking.customerPhone);
  }

  function toggleEditService(serviceId: string) {
    setEditServiceIds((curr) =>
      curr.includes(serviceId) ? curr.filter((id) => id !== serviceId) : [...curr, serviceId]
    );
  }

  async function handleSaveEdit() {
    if (!token || !editingBooking) return;
    if (editServiceIds.length === 0) { setMessage("Selecione pelo menos um serviço."); return; }
    try {
      await apiFetch(`/bookings/${editingBooking._id}`, {
        method: "PATCH", token,
        body: JSON.stringify({ serviceIds: editServiceIds, date: editDate, startTime: editStartTime, customerPhone: editPhone }),
      });
      setMessage("Agendamento atualizado.");
      setEditingBooking(null);
      await loadBookings(token);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Erro ao editar."); }
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
        await loadBookings(savedToken);
        await loadServices(savedToken);
      } catch (e) { setMessage(e instanceof Error ? e.message : "Erro ao validar."); }
    }
    checkAdmin();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayCount = bookings.filter((b) => b.date === today).length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;
  const noShowCount = bookings.filter((b) => b.status === "no_show").length;

  const filteredBookings = statusFilter === "all"
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  const stats = [
    { label: "Hoje", value: todayCount, color: "text-amber-300", bg: "bg-amber-300/10 border-amber-300/20" },
    { label: "Total", value: bookings.length, color: "text-blue-300", bg: "bg-blue-300/10 border-blue-300/20" },
    { label: "Confirmados", value: confirmedCount, color: "text-emerald-300", bg: "bg-emerald-300/10 border-emerald-300/20" },
    { label: "Cancelados", value: cancelledCount, color: "text-red-300", bg: "bg-red-300/10 border-red-300/20" },
    { label: "Faltas", value: noShowCount, color: "text-orange-300", bg: "bg-orange-300/10 border-orange-300/20" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-black border-r border-white/10 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}>

        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Dashboard</p>
          {adminUser && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300/20 text-amber-300 font-bold text-sm flex-shrink-0">
                {adminUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{adminUser.name}</p>
                <p className="text-xs text-zinc-500 truncate">{adminUser.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <a href="/admin"
            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
            <span>📋</span> Agendamentos
          </a>
          <a href="/admin/blacklist"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <span>🚫</span> Blacklist
          </a>
          <a href="/admin/blocks"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <span>🔒</span> Fechamentos
          </a>
          <a href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
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
            <button type="button" onClick={() => setSidebarOpen((o) => !o)}
              className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:text-white md:hidden">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <h1 className="text-lg font-bold">Agendamentos</h1>
          </div>
          <button type="button" onClick={() => token && loadBookings(token)}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:border-white/30 transition-colors">
            ↻ Atualizar
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label}
                className={`rounded-2xl border p-4 ${stat.bg}`}>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {message && (
            <div className="mb-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-sm text-zinc-300 text-center">
              {message}
            </div>
          )}

          {!isAdmin ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center text-zinc-400">
              Aguardando validação...
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  { key: "all", label: "Todos" },
                  { key: "confirmed", label: "Confirmados" },
                  { key: "cancelled", label: "Cancelados" },
                  { key: "no_show", label: "Faltas" },
                  { key: "pending", label: "Pendentes" },
                ].map((f) => (
                  <button key={f.key} type="button" onClick={() => setStatusFilter(f.key)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                      statusFilter === f.key
                        ? "bg-amber-300 text-black"
                        : "border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
                <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_0.8fr_0.8fr_1fr] border-b border-white/10 bg-zinc-900 px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <span>Cliente</span>
                  <span>Serviços</span>
                  <span>Data</span>
                  <span>Horário</span>
                  <span>Duração</span>
                  <span>Total</span>
                  <span>Ações</span>
                </div>
                {filteredBookings.length === 0 ? (
                  <p className="p-8 text-center text-zinc-500">Nenhum agendamento.</p>
                ) : (
                  filteredBookings.map((booking) => (
                    <div key={booking._id}
                      className="grid grid-cols-[1fr_1.5fr_1fr_1fr_0.8fr_0.8fr_1fr] items-center gap-3 border-b border-white/5 px-5 py-4 text-sm hover:bg-white/2 transition-colors">
                      <div>
                        <p className="font-semibold truncate">{booking.customerName}</p>
                        <p className="text-xs text-zinc-500 truncate">{booking.customerPhone}</p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[booking.status] ?? "bg-zinc-800 text-zinc-300"}`}>
                          {STATUS_LABELS[booking.status] ?? booking.status}
                        </span>
                      </div>
                      <div className="text-zinc-300 text-xs">{booking.serviceNames.join(", ")}</div>
                      <div className="text-zinc-300">{booking.date}</div>
                      <div className="text-zinc-300">{booking.startTime} – {booking.endTime}</div>
                      <div className="text-zinc-400">{booking.totalDurationInMinutes} min</div>
                      <div className="font-semibold text-amber-300">€ {booking.totalPrice}</div>
                      <div className="flex flex-col gap-1.5">
                        <button type="button" onClick={() => openEditModal(booking)}
                          className="rounded-lg bg-amber-300/20 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-300 hover:text-black transition-colors">
                          Editar
                        </button>
                        {booking.status === "confirmed" && (
                          <>
                            <button type="button" onClick={() => handleCancel(booking._id)}
                              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold hover:bg-white hover:text-black transition-colors">
                              Cancelar
                            </button>
                            <button type="button" onClick={() => handleNoShow(booking._id)}
                              className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500 hover:text-white transition-colors">
                              Falta
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 lg:hidden">
                {filteredBookings.length === 0 ? (
                  <p className="rounded-2xl border border-white/10 p-8 text-center text-zinc-500">
                    Nenhum agendamento.
                  </p>
                ) : (
                  filteredBookings.map((booking) => (
                    <div key={booking._id}
                      className="rounded-2xl border border-white/10 bg-zinc-900 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold">{booking.customerName}</p>
                          <p className="text-xs text-zinc-500">{booking.customerPhone}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold flex-shrink-0 ${STATUS_COLORS[booking.status] ?? "bg-zinc-800 text-zinc-300"}`}>
                          {STATUS_LABELS[booking.status] ?? booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-xl bg-black p-3">
                          <p className="text-xs text-zinc-500">Serviços</p>
                          <p className="mt-1 text-xs font-medium">{booking.serviceNames.join(", ")}</p>
                        </div>
                        <div className="rounded-xl bg-black p-3">
                          <p className="text-xs text-zinc-500">Data & Hora</p>
                          <p className="mt-1 text-xs font-medium">{booking.date}</p>
                          <p className="text-xs text-zinc-400">{booking.startTime} – {booking.endTime}</p>
                        </div>
                        <div className="rounded-xl bg-black p-3">
                          <p className="text-xs text-zinc-500">Duração</p>
                          <p className="mt-1 text-xs font-medium">{booking.totalDurationInMinutes} min</p>
                        </div>
                        <div className="rounded-xl bg-black p-3">
                          <p className="text-xs text-zinc-500">Total</p>
                          <p className="mt-1 text-sm font-bold text-amber-300">€ {booking.totalPrice}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button type="button" onClick={() => openEditModal(booking)}
                          className="flex-1 rounded-xl bg-amber-300/20 py-2.5 text-sm font-bold text-amber-300 hover:bg-amber-300 hover:text-black transition-colors">
                          Editar
                        </button>
                        {booking.status === "confirmed" && (
                          <>
                            <button type="button" onClick={() => handleCancel(booking._id)}
                              className="flex-1 rounded-xl bg-white/5 py-2.5 text-sm font-bold hover:bg-white hover:text-black transition-colors">
                              Cancelar
                            </button>
                            <button type="button" onClick={() => handleNoShow(booking._id)}
                              className="flex-1 rounded-xl bg-red-500/10 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white transition-colors">
                              Falta
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {editingBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Editar agendamento</h2>
                <p className="mt-1 text-sm text-zinc-400">Cliente: {editingBooking.customerName}</p>
              </div>
              <button type="button" onClick={() => setEditingBooking(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white hover:text-black transition-colors">
                ✕
              </button>
            </div>

            <h3 className="mb-3 font-bold text-sm text-zinc-300 uppercase tracking-wider">Serviços</h3>
            <div className="grid gap-2 sm:grid-cols-2 mb-6">
              {services.map((service) => {
                const selected = editServiceIds.includes(service._id);
                return (
                  <button key={service._id} type="button" onClick={() => toggleEditService(service._id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      selected ? "border-amber-300 bg-amber-300/10" : "border-white/10 bg-zinc-900 hover:border-white/30"
                    }`}>
                    <p className="font-bold text-sm">{service.name}</p>
                    <p className="text-xs text-zinc-400 mt-1">{service.durationInMinutes} min</p>
                    <p className="mt-2 text-sm font-bold text-amber-300">€ {service.price}</p>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Data</label>
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-amber-300 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Horário</label>
                <input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-amber-300 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Telefone</label>
                <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-amber-300 transition-colors" />
              </div>
            </div>

            {message && (
              <p className="mb-4 rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-zinc-300 text-center">{message}</p>
            )}

            <button type="button" onClick={handleSaveEdit}
              className="w-full rounded-xl bg-amber-200 px-6 py-4 font-bold text-black hover:bg-amber-400 transition-colors">
              SALVAR ALTERAÇÕES
            </button>
          </div>
        </div>
      )}
    </div>
  );
}