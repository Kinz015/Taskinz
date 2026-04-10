"use client";

import InviteActions from "../inviteActions";
import { Prisma } from "@prisma/client";

type Invite = Prisma.ProjectInviteGetPayload<{
  include: {
    project: true;
    inviter: true;
  };
}>;

type Props = {
  invites: Invite[];
};

export default function InviteList({ invites }: Props) {
  if (invites.length === 0) {
    return <p className="text-sm text-gray-400">Sem convites</p>;
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <div key={invite.id} className="p-3 rounded-lg bg-zinc-800">
          <p className="text-sm text-gray-200">
            <b>{invite.inviter.name}</b> convidou você para o projeto{" "}
            <b>{invite.project.title}</b>
          </p>

          <InviteActions inviteId={invite.id} />
        </div>
      ))}
    </div>
  );
}