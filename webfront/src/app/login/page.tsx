"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useSearchParams } from "next/navigation";


type LoginResponse = {
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
    };
    accessToken: string;
};

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectParam = searchParams.get("redirect");
    const redirect =
        redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
            ? redirectParam
            : "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage("");

        try {
            const data = await apiFetch<LoginResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            localStorage.setItem("accessToken", data.accessToken);

            if (data.user.role === "admin") {
                router.push("/admin");
                return;
            }

            if (redirect.startsWith("/admin")) {
                router.push("/agendar");
                return;
            }

            router.push(redirect);
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Erro ao fazer login."
            );
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8"
            >
                <h1 className="text-center text-3xl font-bold">
                    Entrar
                </h1>

                <p className="mt-3 text-center text-zinc-400">
                    Faça login para confirmar o seu agendamento.
                </p>

                <div className="mt-8">
                    <label className="text-sm font-semibold text-zinc-300">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-300"
                        placeholder="seuemail@email.com"
                    />
                </div>

                <div className="mt-5">
                    <label className="text-sm font-semibold text-zinc-300">
                        Senha
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-300"
                        placeholder="Digite sua senha"
                    />
                </div>

                {message && (
                    <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-200">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    className="mt-8 w-full rounded-xl bg-amber-200 px-6 py-4 font-bold text-black hover:bg-amber-400"
                >
                    ENTRAR
                </button>


                <a
                    href="/register"
                    className="mt-5 block text-center text-sm text-zinc-400 hover:text-white"
                >
                    Criar uma conta
                </a>

                <a
                    href="/"
                    className="mt-5 block text-center text-sm text-zinc-400 hover:text-white"
                >
                    Voltar para a página inicial
                </a>
            </form>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">Carregando...</main>}>
            <LoginPageContent />
        </Suspense>
    );
}
