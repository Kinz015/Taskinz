"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const body =
      mode === "login" ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro na autenticação");
        setLoading(false);
        return;
      }

      if (mode === "login") {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            placeholder="Seu nome"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
       focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      )}

      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          type="email"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title="Informe um e-mail válido"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
           focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      {/* Senha */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          type="password"
          placeholder="••••••••"
          pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{8,}$"
          title="A senha deve ter no mínimo 8 caracteres, incluindo letra, número e caractere especial"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
           focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-md bg-green-600 py-2 text-sm font-semibold text-white
        transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600/30
        disabled:opacity-50 hover:cursor-pointer"
      >
        {loading
          ? mode === "login"
            ? "Entrando..."
            : "Cadastrando..."
          : mode === "login"
          ? "Entrar"
          : "Cadastrar"}
      </button>

      {/* Erro inline */}
      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {/* Links */}
      <div className="text-center text-sm">
        {mode === "login" ? (
          <Link href="/register">Não tem conta? Criar agora</Link>
        ) : (
          <Link href="/login">Já possui conta? Entrar</Link>
        )}
      </div>
    </form>
  );
}
