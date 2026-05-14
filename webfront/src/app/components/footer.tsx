export default function Footer() {
    return (
        <footer id="contact" className="w-full border-t border-white/10 bg-black px-6 py-16 text-white">
            <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
                <div>
                    <h2 className="text-2xl font-bold">
                        Barbearia Premium
                    </h2>
                    <p className="mt-4 text-zinc-400">
                        Agende o seu corte de forma rápida, simples e inteligente.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold">
                        Contato
                    </h3>
                    <p>Tel: +351 999 999 999</p>
                    <p>Email: barbearia@ggg.com</p>
                    <p>Local: Lisboa, Portugal</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold">
                        Horário
                    </h3>
                    <p>Segunda : Fechado</p>
                    <p>Terça a Sexta: 09:00 - 19:00</p>
                    <p>Sábado e Domingo: 09:00 - 17:00</p>
                </div>
            </div>
            <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-center text-sm text-zinc-500">
                © 2026 Barbearia Premium. Todos os direitos reservados.
            </div>
        </footer>
    );
}