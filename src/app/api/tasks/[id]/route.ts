import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/tasks/:id
 * Buscar uma task específica
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const task = await prisma.task.findUnique({
    where: { id: Number(params.id) },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(task);
}

/**
 * PUT /api/tasks/:id
 * Atualizar uma task
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const task = await prisma.task.update({
    where: { id: Number(params.id) },
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
      dueAt: body.dueAt ? new Date(body.dueAt) : null,
      assigneeId: body.assigneeId ?? null,
    },
  });

  return NextResponse.json(task);
}

/**
 * DELETE /api/tasks/:id
 * Remover uma task
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ success: true });
}
