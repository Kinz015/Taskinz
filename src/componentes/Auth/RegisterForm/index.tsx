"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Erro ao cadastrar");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setName("");
    setEmail("");
    setPassword("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          value={name}
          placeholder="Seu nome"
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
           focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
           focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      {/* Senha */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
           focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={loading}
        className="
            w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white
            hover:bg-indigo-700 hover:cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-50
          "
      >
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>

      {/* Feedback */}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      {success && (
        <p className="text-center text-sm text-green-400">
          Usuário criado com sucesso
        </p>
      )}
      <div className="text-center">
        <Link href="/login">Ainda não possue uma conta?</Link>
      </div>
    </form>
  );
}
