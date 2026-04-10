"use client";

export default function InviteActions({ inviteId }: { inviteId: number }) {
  const handleAccept = async () => {
    await fetch(`/api/invites/${inviteId}/accept`, {
      method: "POST",
    });

    location.reload();
  };

  const handleReject = async () => {
    await fetch(`/api/invites/${inviteId}/reject`, {
      method: "POST",
    });

    location.reload();
  };

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={handleAccept}
        className="bg-green-600 px-3 py-1 rounded text-white"
      >
        Aceitar
      </button>

      <button
        onClick={handleReject}
        className="bg-red-600 px-3 py-1 rounded text-white"
      >
        Recusar
      </button>
    </div>
  );
}
