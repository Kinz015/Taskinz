"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, registerSchema } from "@/lib/validatros/auth";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const schema = mode === "login" ? loginSchema : registerSchema;

    const payload =
      mode === "login" ? { email, password } : { name, email, password };

    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      setLoading(false);
      return;
    }

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        credentials: "include", // 🔥 ESSENCIAL
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro na autenticação");
        return;
      }

      if (mode === "login") {
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
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
            focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Senha
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm
          focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-md bg-green-600 py-2 text-sm font-semibold text-white
        transition hover:bg-green-700 disabled:opacity-50"
      >
        {loading
          ? mode === "login"
            ? "Entrando..."
            : "Cadastrando..."
          : mode === "login"
            ? "Entrar"
            : "Cadastrar"}
      </button>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

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
