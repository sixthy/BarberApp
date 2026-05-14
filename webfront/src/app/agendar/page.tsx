"use client";

import { useEffect, useMemo, useState, } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type BarberService = {
  _id: string;
  name: string;
  price: number;
  durationInMinutes: number;
  isActive: boolean;
};

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type AvailableTime = {
  startTime: string;
  endTime: string;
};

type AvailableTimesResponse = {
  date: string;
  isClosed: boolean;
  openingTime?: string;
  closingTime?: string;
  totalDurationInMinutes?: number;
  availableTimes: AvailableTime[];
  message?: string;
};

export default function AgendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdFromUrl = searchParams.get("serviceId");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [services, setServices] = useState<BarberService[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    setToken(savedToken);

    async function loadServices() {
      const data = await apiFetch<BarberService[]>("/services/active");
      setServices(data);

      if (serviceIdFromUrl) {
        setSelectedServiceIds([serviceIdFromUrl]);
      } else if (data.length > 0) {
        setSelectedServiceIds([data[0]._id]);
      }
    }

    async function loadUser(currentToken: string) {
      const data = await apiFetch<AuthUser>("/auth/me", {
        token: currentToken,
      });

      setUser(data);
    }

    loadServices();

    if (savedToken) {
      loadUser(savedToken).catch(() => {
        localStorage.removeItem("accessToken");
        setToken(null);
        setUser(null);
      });
    }
  }, [serviceIdFromUrl]);

  const selectedServices = useMemo(() => {
    return services.filter((service) =>
      selectedServiceIds.includes(service._id)
    );
  }, [services, selectedServiceIds]);

  const totalPrice = selectedServices.reduce(
    (total, service) => total + service.price,
    0
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.durationInMinutes,
    0
  );

  function toggleService(serviceId: string) {
    setSelectedTime("");
    setAvailableTimes([]);
    setIsClosed(false);
    setMessage("");

    if (selectedServiceIds.includes(serviceId)) {
      if (selectedServiceIds.length === 1) {
        return;
      }

      setSelectedServiceIds(
        selectedServiceIds.filter((id) => id !== serviceId)
      );
    } else {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  }

  async function handleSearchTimes() {
    setMessage("");
    setSelectedTime("");
    setAvailableTimes([]);
    setIsClosed(false);

    if (!selectedDate) {
      setMessage("Escolha uma data primeiro.");
      return;
    }

    if (selectedServiceIds.length === 0) {
      setMessage("Escolha pelo menos um serviço.");
      return;
    }
    try {
      const data = await apiFetch<AvailableTimesResponse>(
        `/schedules/available?date=${selectedDate}&serviceIds=${selectedServiceIds.join(",")}`
      );

      setAvailableTimes(data.availableTimes);

      if (data.isClosed) {
        setMessage(data.message || "Barbearia fechada neste dia.");
        return;
      }

      if (data.availableTimes.length === 0) {
        setMessage("Nenhum horário disponível para esta data.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao buscar o horário"
      );
    }
  }

  async function handleConfirmBooking() {
    const savedToken = localStorage.getItem("accessToken");

    if (!savedToken) {
      const redirect = encodeURIComponent(
        `/agendar${serviceIdFromUrl ? `?serviceId=${serviceIdFromUrl}` : ""}`
      );

      router.push(`/login?redirect=${redirect}`);
      return;
    }

    if (selectedServiceIds.length === 0) {
      setMessage("Selecione pelo menos um serviço.");
      return;
    }

    if (!selectedDate) {
      setMessage("Selecione uma data.");
      return;
    }

    if (!selectedTime) {
      setMessage("Selecione um horário.");
      return;
    }

    if (!phone.trim()) {
      setMessage("Informe o telefone do cliente.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await apiFetch("/bookings", {
        method: "POST",
        token: savedToken,
        body: JSON.stringify({
          serviceIds: selectedServiceIds,
          date: selectedDate,
          startTime: selectedTime,
          customerPhone: phone,
        }),
      });

      setShowSuccessModal(true);

      setTimeout(() => {
        router.push("/");
      }, 10000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao confirmar agendamento."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const confirmDisabled =
    isSubmitting ||
    isClosed ||
    selectedServiceIds.length === 0 ||
    !selectedDate ||
    !selectedTime ||
    !phone.trim();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">
            Agende Seu Horário
          </h1>

          <p className="mt-4 text-zinc-400">
            Escolha os serviços, a data, o horário e confirme o seu agendamento.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-black p-8">
            <div className="mb-8 rounded-2xl border border-white/10 bg-zinc-900 p-5">

              {user ? (
                <>
                  <h2 className="mt-2 text-2xl font-bold">{user.name}</h2>
                  <p className="mt-1 text-zinc-400">{user.email}</p>
                </>
              ) : (
                <p className="mt-2 text-zinc-400">
                  Nenhum usuário logado. Faça login antes de confirmar.
                </p>
              )}
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                Serviços
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => {
                  const selected = selectedServiceIds.includes(service._id);

                  return (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => toggleService(service._id)}
                      className={`rounded-2xl border p-5 text-left transition ${selected
                        ? "border-amber-300 bg-amber-300/10"
                        : "border-white/10 bg-zinc-900 hover:border-white/40"
                        }`}
                    >
                      <h3 className="text-lg font-bold">{service.name}</h3>

                      <p className="mt-2 text-sm text-zinc-400">
                        {service.durationInMinutes} min
                      </p>

                      <p className="mt-4 text-xl font-bold text-amber-200">
                        € {service.price},00
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                Data
              </h2>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setAvailableTimes([]);
                  setSelectedTime("");
                  setIsClosed(false);
                  setMessage("");
                }}
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-5 py-4 text-white outline-none focus:border-amber-300"
              />

              <button
                type="button"
                onClick={handleSearchTimes}
                className="mt-4 rounded-xl bg-white px-6 py-3 font-bold text-black hover:bg-zinc-300"
              >
                BUSCAR HORÁRIOS
              </button>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                Horários disponíveis
              </h2>

              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
                {availableTimes.map((time) => (
                  <button
                    key={time.startTime}
                    type="button"
                    onClick={() => setSelectedTime(time.startTime)}
                    className={`rounded-xl border px-4 py-3 font-semibold transition ${selectedTime === time.startTime
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-white/10 bg-zinc-900 hover:border-white/40"
                      }`}
                  >
                    {time.startTime}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">
                Contato do cliente
              </h2>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Digite o seu telefone"
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-5 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-amber-300"
              />
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-black p-8">
            <h2 className="text-2xl font-bold">
              Resumo do agendamento
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="text-sm text-zinc-400">Serviços</p>

                {selectedServices.map((service) => (
                  <p key={service._id} className="mt-1 font-bold">
                    {service.name}
                  </p>
                ))}
              </div>

              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="text-sm text-zinc-400">Data</p>
                <p className="mt-1 font-bold">
                  {selectedDate || "Nenhuma data selecionada"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="text-sm text-zinc-400">Horário</p>
                <p className="mt-1 font-bold">
                  {selectedTime || "Nenhum horário selecionado"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="text-sm text-zinc-400">Telefone</p>
                <p className="mt-1 font-bold">
                  {phone || "Não informado"}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex justify-between text-zinc-400">
                <span>Duração total</span>
                <span>{totalDuration} min</span>
              </div>

              <div className="mt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-amber-300">€ {totalPrice},00</span>
              </div>
            </div>

            {message && (
              <p className="mt-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-center text-sm text-zinc-300">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={confirmDisabled}
              className={`mt-8 w-full rounded-xl px-6 py-4 font-bold text-black transition ${confirmDisabled
                  ? "cursor-not-allowed bg-zinc-600 text-zinc-300"
                  : "bg-amber-200 hover:bg-amber-400"
                }`}
            >
              {isSubmitting ? "CONFIRMANDO..." : "CONFIRMAR AGENDAMENTO"}
            </button>
          </aside>
        </div>
      </section>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center text-white shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-4xl text-green-300">
              ✓
            </div>

            <h2 className="text-3xl font-bold">
              Agendamento confirmado!
            </h2>

            <p className="mt-4 text-zinc-400">
              O seu horário foi reservado com sucesso. Você será redirecionado para a página inicial.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-zinc-900 p-4 text-left text-sm">
              <p>
                <span className="text-zinc-400">Data:</span>{" "}
                <strong>{selectedDate}</strong>
              </p>

              <p className="mt-2">
                <span className="text-zinc-400">Horário:</span>{" "}
                <strong>{selectedTime}</strong>
              </p>

              <p className="mt-2">
                <span className="text-zinc-400">Telefone:</span>{" "}
                <strong>{phone}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 w-full rounded-xl bg-white px-6 py-4 font-bold text-black hover:bg-zinc-300"
            >
              VOLTAR AGORA
            </button>
          </div>
        </div>
      )}

    </main>
  );
}