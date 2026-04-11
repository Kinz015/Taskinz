import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const user = await requireAuth();
  const { projectId } = await params;
  const projectIdInt = parseInt(projectId);

  // Verifica se é membro
  const membership = await prisma.projectMember.findFirst({
    where: {
      userId: user.id,
      projectId: projectIdInt,
    },
  });

  if (!membership) {
    return NextResponse.json({ error: "Não é membro" }, { status: 403 });
  }

  // Impede dono de sair sem transferir
  if (membership.role === "OWNER") {
    return NextResponse.json(
      { error: "Transfira a propriedade antes de sair" },
      { status: 400 },
    );
  }

  // Remove o usuário
  await prisma.projectMember.delete({
    where: {
      id: membership.id,
    },
  });

  return NextResponse.json({ success: true });
}
