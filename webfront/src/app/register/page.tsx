"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";



type RegisterResponse = {
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
    };
    accessToken: string;
};

function RegisterPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectParam = searchParams.get("redirect");

    const redirect =
        redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
            ? redirectParam
            : "/agendar";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage("");

        try {
            const data = await apiFetch<RegisterResponse>("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                }),
            });

            localStorage.setItem("accessToken", data.accessToken);

            router.push(redirect);
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Erro ao criar conta."
            );
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8"
            >
                <h1 className="text-center text-3xl font-bold">
                    Criar Conta
                </h1>

                <p className="mt-3 text-center text-zinc-400">
                    Crie sua conta para agendar o seu horário.
                </p>

                <div className="mt-8">
                    <label className="text-sm font-semibold text-zinc-300">
                        Nome
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-300"
                        placeholder="Seu nome"
                    />
                </div>

                <div className="mt-5">
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
                        Telefone
                    </label>

                    <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-300"
                        placeholder="+351999999999"
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
                        placeholder="Mínimo 6 caracteres"
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
                    CRIAR CONTA
                </button>

                <a
                    href="/login"
                    className="mt-5 block text-center text-sm text-zinc-400 hover:text-white"
                >
                    Já tenho conta
                </a>

                <a
                    href="/"
                    className="mt-3 block text-center text-sm text-zinc-500 hover:text-white"
                >
                    Voltar para a página inicial
                </a>
            </form>
        </main>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">Carregando...</main>}>
            <RegisterPageContent />
        </Suspense>
    );
}
