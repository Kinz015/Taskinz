import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ inviteId: string }> },
) {
  const user = await requireAuth();
  const { inviteId } = await params;

  const invite = await prisma.projectInvite.findUnique({
    where: { id: Number(inviteId) },
  });

  if (!invite) {
    return NextResponse.json(
      { error: "Convite não encontrado" },
      { status: 404 },
    );
  }

  // 🔥 CRIA O MEMBRO DO PROJETO
  await prisma.projectMember.create({
    data: {
      projectId: invite.projectId,
      userId: user.id,
      role: invite.role,
    },
  });

  // 🔥 ATUALIZA STATUS
  await prisma.projectInvite.update({
    where: { id: invite.id },
    data: { status: "ACCEPTED" },
  });

  return NextResponse.json({ ok: true });
}
