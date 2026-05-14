export default function Body() {
    return (
        <section id="card" className="relative min-h-[calc(100vh-120px)] w-full bg-[url('/barbershop.jpg')] bg-cover bg-center bg-no-repeat px-16 py-32 text-white flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex flex-col items-center gap-6 rounded-3xl bg-black/40 px-10 py-8 text-center backdrop-blur-md border border-white">
                <h1 className="text-5xl font-semibold">
                    Barbearia Premium
                </h1>
                <p className="max-w-md text-lg leading-8 text-zinc-300">
                    Agende o seu corte de forma rápida, simples e inteligente.
                </p>

                <a className="mt-10 rounded-full bg-white px-8 py-3 font-semibold text-black hover:bg-zinc-300"
                    href="/agendar"
                    rel="noopener noreferrer">
                    AGENDAR AGORA
                </a>
            </div>
        </section>
    );
}