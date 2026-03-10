"use client";

import { useState } from "react";

type Props = {
  projectId: number;
  title: string;
  description?: string;
  imageUrl?: string;
};

export default function EditProjectForm({
  projectId,
  title,
  description,
  imageUrl,
}: Props) {
  const [name, setName] = useState(title);
  const [desc, setDesc] = useState(description || "");
  const [image, setImage] = useState(imageUrl || "");
  const [inviteEmail, setInviteEmail] = useState("");

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: name,
        description: desc,
        imageUrl: image,
      }),
    });

    if (!res.ok) {
      alert("Erro ao atualizar projeto");
      return;
    }

    alert("Projeto atualizado com sucesso");
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/projects/${projectId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inviteEmail,
      }),
    });

    setInviteEmail("");
    alert("Convite enviado");
  }

  return (
    <div className="flex flex-col gap-10 max-w-xl">
      {/* EDITAR PROJETO */}
      <form
        onSubmit={handleUpdate}
        className="bg-zinc-900 p-6 rounded-lg flex flex-col gap-4"
      >
        <h2 className="text-lg font-bold text-gray-300">Editar projeto</h2>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Título
        </label>
        <input
          className="p-2 rounded bg-zinc-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do projeto"
        />

        <label className="mb-1 block text-sm font-medium text-gray-300">
          Descrição
        </label>
        <textarea
          className="p-2 rounded bg-zinc-800 text-white"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Descrição"
        />

        <label className="mb-1 block text-sm font-medium text-gray-300">
          Imagem
        </label>
        <input
          className="p-2 rounded bg-zinc-800 text-white"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="URL da imagem"
        />

        <button className="bg-green-600 p-2 rounded">Salvar alterações</button>
      </form>

      {/* CONVIDAR USUÁRIO */}
      <form
        onSubmit={handleInvite}
        className="bg-zinc-900 p-6 rounded-lg flex flex-col gap-4"
      >
        <h2 className="text-lg font-bold text-gray-300">Convidar membro</h2>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Insira o email do usuário que voce desejá convidar
        </label>
        <input
          className="p-2 rounded bg-zinc-800 text-white"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Email do usuário"
        />

        <button className="bg-blue-600 p-2 rounded text-white">
          Enviar convite
        </button>
      </form>
    </div>
  );
}
