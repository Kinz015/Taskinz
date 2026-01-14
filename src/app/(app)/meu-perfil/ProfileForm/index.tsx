"use client";

import { useMemo, useState } from "react";

type UpdateMePayload = {
  name: string;
  imageUrl: string | null;
  currentPassword?: string;
  newPassword?: string;
};

type UpdateMeResponse =
  | {
      ok: true;
      user?: {
        id: string;
        name: string;
        email: string;
        imageUrl: string | null;
      };
    }
  | { error: string };

type Props = {
  initialName: string;
  initialEmail: string;
  initialImageUrl?: string | null;
};

export default function ProfileForm({
  initialName,
  initialEmail,
  initialImageUrl = null,
}: Props) {
  const [name, setName] = useState(initialName);
  const [email] = useState(initialEmail); // email só aparente
  const [imageUrl, setImageUrl] = useState(initialImageUrl ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const changingPassword = useMemo(() => {
    return !!(currentPassword || newPassword || confirmPassword);
  }, [currentPassword, newPassword, confirmPassword]);

  const canSave = useMemo(() => {
    if (!name.trim()) return false;

    if (changingPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) return false;
      if (newPassword.length < 6) return false;
      if (newPassword !== confirmPassword) return false;
    }

    return true;
  }, [name, changingPassword, currentPassword, newPassword, confirmPassword]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setSaving(true);

    try {
      if (changingPassword && newPassword !== confirmPassword) {
        setErr("As senhas não coincidem.");
        setSaving(false);
        return;
      }

      const payload: UpdateMePayload = {
        name,
        imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
      };

      if (changingPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: UpdateMeResponse = await res
        .json()
        .catch(() => ({ error: "Resposta inválida" }));

      if (!res.ok) {
        setErr("error" in data ? data.error : "Erro ao salvar.");
        setSaving(false);
        return;
      }

      setMsg("Perfil atualizado com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaving(false);
    } catch {
      setErr("Erro inesperado ao salvar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* foto + url */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center">
          {imageUrl?.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Foto do perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-white/60 text-sm">Foto</span>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm text-white/70 mb-1">
            URL da imagem
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/30 px-3 py-2 outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* nome + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/70 mb-1">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 outline-none focus:border-white/30"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Email</label>
          <input
            value={email}
            disabled
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white/50 px-3 py-2 cursor-not-allowed"
          />
          <p className="text-xs text-white/40 mt-1">
            Email apenas informativo nesta tela.
          </p>
        </div>
      </div>

      {/* senha */}
      <div className="border-t border-white/10 pt-6">
        <h2 className="text-white font-semibold">Alterar senha</h2>
        <p className="text-white/50 text-sm mt-1">
          Preencha apenas se quiser trocar a senha.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Senha atual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Nova senha
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 outline-none focus:border-white/30"
            />
            <p className="text-xs text-white/40 mt-1">Mínimo 6 caracteres.</p>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Confirmar
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 outline-none focus:border-white/30"
            />
          </div>
        </div>

        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <p className="text-sm text-red-400 mt-2">As senhas não coincidem.</p>
        )}
      </div>

      {/* feedback */}
      {err && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-200 text-sm">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-200 text-sm">
          {msg}
        </div>
      )}

      {/* botão */}
      <div className="flex items-center gap-3">
        <button
          disabled={!canSave || saving}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            !canSave || saving
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "bg-amber-600 text-white hover:bg-amber-700"
          }`}
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
