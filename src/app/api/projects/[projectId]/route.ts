import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const body = await req.json();

  const project = await prisma.project.update({
    where: {
      id: Number(projectId),
    },
    data: {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
    },
  });

  return NextResponse.json(project);
}
