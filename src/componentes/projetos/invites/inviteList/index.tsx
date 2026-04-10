"use client";

import { Invite } from "@/types/invite";
import InviteActions from "../inviteActions";

type Props = {
  invites: Invite[];
};

export default function InviteList({ invites }: Props) {
  if (!invites.length) {
    return <p>Nenhum convite pendente.</p>;
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <div key={invite.id} className="border p-4 rounded-lg">
          <p>
            <b>Projeto:</b> {invite.project.title}
          </p>
          <p>
            <b>Convidado por:</b> {invite.inviter.name}
          </p>

          <InviteActions inviteId={invite.id} />
        </div>
      ))}
    </div>
  );
}
