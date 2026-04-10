import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const user = await requireAuth();

  const { projectId } = await params; // ✅ CORRETO

  const body = await req.json();
  const email = body.email;

  const invite = await prisma.projectInvite.create({
    data: {
      projectId: Number(projectId),
      inviteeEmail: email,
      token: randomUUID(),
      inviterId: user.id,
    },
  });

  return NextResponse.json(invite);
}
