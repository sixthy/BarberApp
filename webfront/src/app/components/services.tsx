import { apiFetch } from "@/lib/api";
import ServiceCardList from "./services-card-list";

type BarberService = {
  _id: string;
  name: string;
  price: number;
  durationInMinutes: number;
  isActive: boolean;
  imageUrl?: string;
};

export default async function Services() {
  let services: BarberService[] = [];

  try {
    services = await apiFetch<BarberService[]>("/services/active", {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
  }

  return (
    <section id="services" className="w-full bg-black px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">
            Tabela de Preços
          </h2>

          <p className="mt-4 text-zinc-400">
            Escolha o serviço desejado e agende o seu horário.
          </p>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-zinc-500">
            Não foi possível carregar os serviços agora.
          </p>
        ) : (
          <ServiceCardList services={services} />
        )}
      </div>
    </section>
  );
}