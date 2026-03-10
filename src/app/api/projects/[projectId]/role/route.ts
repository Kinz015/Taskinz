import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await context.params;

    const user = await requireAuth();

    if (!user) {
      return NextResponse.json({ role: null }, { status: 401 });
    }

    const membership = await prisma.projectMember.findFirst({
      where: {
        userId: user.id,
        projectId: Number(projectId),
      },
      select: {
        role: true,
      },
    });

    return NextResponse.json({
      role: membership?.role ?? null,
    });
  } catch (error) {
    console.error("ROLE API ERROR:", error);

    return NextResponse.json({ error: "Erro ao buscar role" }, { status: 500 });
  }
}
