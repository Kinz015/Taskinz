import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = { id: string };

/**
 * GET /api/tasks/:id
 * Buscar uma task específica
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
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
    return NextResponse.json({ error: "Task não encontrada" }, { status: 404 });
  }

  return NextResponse.json(task);
}

/**
 * PUT /api/tasks/:id
 * Atualizar uma task
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        assigneeId: body.assigneeId ?? null,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("PUT /api/tasks/[id] erro:", error);

    return NextResponse.json(
      { message: "Erro interno ao atualizar task" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/:id
 * Remover uma task
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] erro:", error);

    return NextResponse.json(
      { message: "Erro ao excluir task" },
      { status: 500 }
    );
  }
}
