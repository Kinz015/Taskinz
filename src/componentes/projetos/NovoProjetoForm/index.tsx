"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Image as ImageIcon, X } from "lucide-react";

export default function NovoProjetoForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Título é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          imageUrl: imageUrl.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? data?.message ?? "Erro ao criar projeto.");
        return;
      }

      router.replace("/projetos");
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f12] px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Criar projeto
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Preencha o básico: título, descrição (opcional) e imagem (opcional).
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
        >
          <label className="block text-sm font-medium text-white/80">
            Título <span className="text-red-400">*</span>
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 focus-within:border-white/20">
            <FolderPlus className="h-5 w-5 text-white/50" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Taskinz v2"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              maxLength={80}
              autoFocus
            />
          </div>

          <label className="mt-5 block text-sm font-medium text-white/80">
            Descrição (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva rapidamente o objetivo do projeto..."
            className="mt-2 min-h-27.5 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/20"
            maxLength={400}
          />

          <label className="mt-5 block text-sm font-medium text-white/80">
            Imagem (URL opcional)
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 focus-within:border-white/20">
            <ImageIcon className="h-5 w-5 text-white/50" />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
            {imageUrl.trim() ? (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Limpar imagem"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar projeto"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
