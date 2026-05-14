"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type BarberService = {
  _id: string;
  name: string;
  price: number;
  durationInMinutes: number;
  isActive: boolean;
  imageUrl?: string;
};

type Props = {
  services: BarberService[];
};

const serviceImages: Record<string, string> = {
  "Corte Tesoura": "/corte1.jpg",
  "Corte Barba": "/barba1.jpg",
  "Ajuste Sobrancelha": "/sobrancelha1.jpg",
  "Corte Máquina": "/maquina.jpg",
  "Corte Maquina": "/maquina.jpg",
};

function getServiceImage(service: BarberService) {
  if (service.imageUrl) {
    return service.imageUrl.startsWith("/")
      ? service.imageUrl
      : `/${service.imageUrl}`;
  }

  return serviceImages[service.name] || "/barba1.jpg";
}

function getServiceName(name: string) {
  if (name === "Corte M�quina") {
    return "Corte Máquina";
  }

  if (name === "Corte Maquina") {
    return "Corte Máquina";
  }

  return name;
}

export default function ServiceCardList({ services }: Props) {
  const router = useRouter();

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  function handleSchedule(serviceId: string) {
    const token = localStorage.getItem("accessToken");

    if (token) {
      router.push(`/agendar?serviceId=${serviceId}`);
      return;
    }

    setSelectedServiceId(serviceId);
    setShowLoginModal(true);
  }

  function goToLogin() {
    if (!selectedServiceId) return;

    const redirect = encodeURIComponent(`/agendar?serviceId=${selectedServiceId}`);
    router.push(`/login?redirect=${redirect}`);
  }

  function goToRegister() {
    if (!selectedServiceId) return;

    const redirect = encodeURIComponent(`/agendar?serviceId=${selectedServiceId}`);
    router.push(`/register?redirect=${redirect}`);
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
          >
            <div className="relative h-44 w-full">
              <Image
                src={getServiceImage(service)}
                alt={getServiceName(service.name)}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white">
                  {getServiceName(service.name)}
                </h3>

                <span className="text-zinc-500">✂️</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xl font-semibold text-white">
                  € {service.price},00
                </p>

                <span className="rounded-md border border-white/10 bg-black px-3 py-1 text-xs text-zinc-300">
                  {service.durationInMinutes} MIN
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSchedule(service._id)}
                className="mt-6 flex w-full items-center justify-center rounded-md bg-white/20 px-4 py-3 font-bold text-white hover:bg-zinc-300 hover:text-black"
              >
                AGENDAR
              </button>
            </div>
          </div>
        ))}
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">
              Faça login para agendar
            </h2>

            <p className="mt-4 text-zinc-400">
              Para escolher o melhor horário e confirmar o agendamento, entre na sua conta.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={goToLogin}
                className="rounded-xl bg-amber-200 px-6 py-4 font-bold text-black hover:bg-amber-400"
              >
                ENTRAR
              </button>

              <button
                type="button"
                onClick={goToRegister}
                className="rounded-xl border border-white/10 px-6 py-4 font-bold text-white hover:bg-white hover:text-black"
              >
                CRIAR CONTA
              </button>

              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="text-sm text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}