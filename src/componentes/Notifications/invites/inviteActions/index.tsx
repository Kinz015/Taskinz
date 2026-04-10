"use client";

type Props = {
  inviteId: number;
};

export default function InviteActions({ inviteId }: Props) {
  const handleAccept = async () => {
    const res = await fetch(`/api/invites/${inviteId}`, {
      method: "POST",
    });

    if (!res.ok) {
      alert("Erro ao aceitar");
      return;
    }

    location.reload();
  };

  const handleReject = async () => {
    const res = await fetch(`/api/invites/${inviteId}`, {
      method: "POST",
    });

    if (!res.ok) {
      alert("Erro ao recusar");
      return;
    }

    location.reload();
  };

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={handleAccept}
        className="bg-green-600 px-2 py-1 text-xs rounded text-white"
      >
        Aceitar
      </button>

      <button
        onClick={handleReject}
        className="bg-red-600 px-2 py-1 text-xs rounded text-white"
      >
        Recusar
      </button>
    </div>
  );
}
