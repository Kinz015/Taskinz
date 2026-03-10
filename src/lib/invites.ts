import { prisma } from "@/lib/prisma";

export async function getUserInvites(userId: string, email: string) {
  return prisma.projectInvite.findMany({
    where: {
      status: "PENDING",
      OR: [{ inviteeId: userId }, { inviteeEmail: email }],
    },
    include: {
      project: true,
      inviter: true,
    },
  });
}
