import { Prisma } from "@prisma/client";

export type Invite = Prisma.ProjectInviteGetPayload<{
  include: {
    project: true;
    inviter: true;
  };
}>;
