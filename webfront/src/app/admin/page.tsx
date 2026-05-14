"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type BarberService = {
    _id: string;
    name: string;
    price: number;
    durationInMinutes: number;
    isActive: boolean;
};

type Booking = {
    _id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceNames: string[];
    serviceIds: string[];
    totalPrice: number;
    totalDurationInMinutes: number;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
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


    async function loadServices(currentToken: string) {
        const data = await apiFetch<BarberService[]>("/services/active", {
            token: currentToken,
        });

        setServices(data);
    }

    async function loadBookings(currentToken: string) {
        const data = await apiFetch<Booking[]>("/bookings", {
            token: currentToken,
        });

        setBookings(data);
    }

    async function handleCancel(id: string) {
        if (!token) return;

        setMessage("");

        try {
            await apiFetch(`/bookings/${id}/cancel`, {
                method: "PATCH",
                token,
            });

            setMessage("Agendamento cancelado.");
            await loadBookings(token);
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Erro ao cancelar."
            );
        }
    }

    async function handleNoShow(id: string) {
        if (!token) return;

        setMessage("");

        try {
            await apiFetch(`/bookings/${id}/no-show`, {
                method: "PATCH",
                token,
            });

            setMessage("Falta registrada.");
            await loadBookings(token);
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Erro ao marcar falta."
            );
        }
    }

    function openEditModal(booking: Booking) {
        setEditingBooking(booking);

        setEditServiceIds(booking.serviceIds.map(String));
        setEditDate(booking.date);
        setEditStartTime(booking.startTime);
        setEditPhone(booking.customerPhone);
    }

    function toggleEditService(serviceId: string) {
        setEditServiceIds((current) => {
            if (current.includes(serviceId)) {
                return current.filter((id) => id !== serviceId);
            }

            return [...current, serviceId];
        });
    }

    async function handleSaveEdit() {
        if (!token || !editingBooking) return;

        setMessage("");

        if (editServiceIds.length === 0) {
            setMessage("Selecione pelo menos um serviço.");
            return;
        }

        try {
            await apiFetch(`/bookings/${editingBooking._id}`, {
                method: "PATCH",
                token,
                body: JSON.stringify({
                    serviceIds: editServiceIds,
                    date: editDate,
                    startTime: editStartTime,
                    customerPhone: editPhone,
                }),
            });

            setMessage("Agendamento atualizado com sucesso.");
            setEditingBooking(null);
            await loadBookings(token);
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Erro ao editar agendamento."
            );
        }
    }

    function handleLogout() {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
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
                await loadBookings(savedToken);
                await loadServices(savedToken);
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
            <section className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Dashboard Admin
                        </h1>

                        <p className="mt-3 text-zinc-400">
                            Gerencie agendamentos, cancelamentos e faltas.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                        {adminUser && (
                            <div className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-4">
                                <p className="text-sm text-zinc-400"></p>
                                <p className="mt-1 font-bold">{adminUser.name}</p>
                                <p className="text-sm text-zinc-500">{adminUser.email}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/admin/blacklist"
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white hover:text-black"
                            >
                                BLACKLIST
                            </a>

                            <a
                                href="/admin/blocks"
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white hover:text-black"
                            >
                                FECHAMENTO
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
                        <div className="grid grid-cols-9 border-b border-white/10 bg-zinc-900 px-5 py-4 text-sm font-bold text-zinc-300">
                            <span>Cliente</span>
                            <span className="col-span-2">Serviços</span>
                            <span>Data</span>
                            <span>Horário</span>
                            <span>Duração</span>
                            <span>Total</span>
                            <span>Status</span>
                            <span>Ações</span>
                        </div>

                        <div>
                            {bookings.length === 0 ? (
                                <p className="p-6 text-center text-zinc-500">
                                    Nenhum agendamento encontrado.
                                </p>
                            ) : (
                                bookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="grid grid-cols-9 items-center gap-3 border-b border-white/10 px-5 py-4 text-sm"
                                    >
                                        <div>
                                            <p className="font-bold">{booking.customerName}</p>
                                            <p className="text-xs text-zinc-500">
                                                {booking.customerEmail}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {booking.customerPhone}
                                            </p>
                                        </div>

                                        <div className="col-span-2 text-zinc-300">
                                            {booking.serviceNames.join(", ")}
                                        </div>

                                        <div>{booking.date}</div>

                                        <div>
                                            {booking.startTime} - {booking.endTime}
                                        </div>

                                        <div>{booking.totalDurationInMinutes} min</div>

                                        <div>€ {booking.totalPrice},00</div>

                                        <div>
                                            <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs">
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(booking)}
                                                className="rounded-lg bg-amber-200 px-3 py-2 text-xs font-bold text-black hover:bg-amber-400"
                                            >
                                                Editar
                                            </button>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white hover:text-black"
                                                >
                                                    Cancelar
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleNoShow(booking._id)}
                                                    className="rounded-lg bg-red-500/20 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500 hover:text-white"
                                                >
                                                    Falta
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </section>
            {editingBooking && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6">
                    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-8 text-white">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Editar agendamento
                                </h2>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Cliente: {editingBooking.customerName}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingBooking(null)}
                                className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white hover:text-black"
                            >
                                X
                            </button>
                        </div>

                        <div className="mt-8">
                            <h3 className="mb-3 font-bold">Serviços</h3>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {services.map((service) => {
                                    const selected = editServiceIds.includes(service._id);

                                    return (
                                        <button
                                            key={service._id}
                                            type="button"
                                            onClick={() => toggleEditService(service._id)}
                                            className={`rounded-xl border p-4 text-left ${selected
                                                ? "border-amber-300 bg-amber-300/10"
                                                : "border-white/10 bg-zinc-900"
                                                }`}
                                        >
                                            <p className="font-bold">{service.name}</p>
                                            <p className="text-sm text-zinc-400">
                                                {service.durationInMinutes} min
                                            </p>
                                            <p className="mt-2 font-bold text-amber-200">
                                                € {service.price},00
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="text-sm text-zinc-400">Data</label>
                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(event) => setEditDate(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-300"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400">Horário</label>
                                <input
                                    type="time"
                                    value={editStartTime}
                                    onChange={(event) => setEditStartTime(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-300"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400">Telefone</label>
                                <input
                                    type="tel"
                                    value={editPhone}
                                    onChange={(event) => setEditPhone(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-300"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="mt-8 w-full rounded-xl bg-amber-200 px-6 py-4 font-bold text-black hover:bg-amber-400"
                        >
                            SALVAR ALTERAÇÕES
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}