export default function Booking() {
    return (
        <section id="agendar" className="w-full bg-zinc-950 px-6 py-24">
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-zinc-900 px-8 py-16 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/0 text-4xl text-zinc-400">
                    <img src="clock1.png" alt="clock" />
                </div>

                <h2 className="text-3xl font-bold text-white">
                    Faça Login Para Agendar
                </h2>

                <p className="mx-auto mt-4 max-w-md text-zinc-400">
                    Entre com sua conta para escolher o serviço, selecionar o melhor horário e confirmar o seu agendamento.
                </p>

                <a className="mx-auto mt-8 flex w-full max-w-xs items-center justify-center rounded-md bg-white/10 px-6 py-4 font-bold tracking-widest text-white hover:bg-zinc-300"
                    href="/login"
                >
                    AGENDAR AGORA
                </a>
            </div>
        </section>
    );
}