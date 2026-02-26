"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Image as ImageIcon, X } from "lucide-react";

export default function NovoProjetoForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecione uma imagem válida.");
      return;
    }

    // ✅ revoga preview antigo
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    setSelectedFile(file);
  }

  function addTag() {
    const value = tagInput.trim().toLowerCase();

    if (!value) return;

    if (tags.length >= 5) {
      setError("Máximo de 5 tags por projeto.");
      return;
    }

    if (tags.includes(value)) {
      setError("Essa tag já foi adicionada.");
      return;
    }

    setTags([...tags, value]);
    setTagInput("");
    setError(null);
  }

  function removeTag(name: string) {
    setTags(tags.filter((tag) => tag !== name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Título é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("tags", JSON.stringify(tags));

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        body: formData,
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
            Imagem do Projeto
          </label>

          <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 focus-within:border-white/20">
            <ImageIcon className="h-5 w-5 text-white/50" />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-transparent text-sm text-white outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-1 file:text-white hover:file:bg-white/20"
            />
          </div>

          {previewUrl ? (
            <div className="mt-4 relative h-48 w-48 overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                  });

                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition"
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mt-4 text-xs text-white/50 italic">
              Nenhuma imagem selecionada.
            </div>
          )}

          <label className="mt-5 block text-sm font-medium text-white/80">
            Tags (máx. 5)
          </label>

          <div className="mt-2 flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Digite uma tag"
              className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35"
              maxLength={20}
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              Adicionar
            </button>
          </div>

          {tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-xs text-white/50 italic">
              Sem tags vinculadas.
            </div>
          )}

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
