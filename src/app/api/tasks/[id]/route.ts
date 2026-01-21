import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

type Params = { id: string };

/**
 * GET /api/tasks/:id
 * Buscar uma task específica (SÓ do usuário logado)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const user = await requireAuth();

  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const task = await prisma.task.findFirst({
    where: { id: taskId, authorId: user.id }, // 🔒 trava por dono
    include: {
      author: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task não encontrada" }, { status: 404 });
  }

  return NextResponse.json(task);
}

/**
 * PUT /api/tasks/:id
 * Atualizar uma task (SÓ se for do usuário logado)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const user = await requireAuth();

  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const result = await prisma.task.updateMany({
      where: { id: taskId, authorId: user.id }, // 🔒 trava por dono
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        assigneeId: body.assigneeId ?? null,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Task não encontrada" },
        { status: 404 }
      );
    }

    // (opcional) retornar a task atualizada já com include
    const updated = await prisma.task.findFirst({
      where: { id: taskId, authorId: user.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(updated);
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
 * Remover uma task (SÓ se for do usuário logado)
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const user = await requireAuth();

  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const result = await prisma.task.deleteMany({
      where: { id: taskId, authorId: user.id }, // 🔒 trava por dono
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Task não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] erro:", error);
    return NextResponse.json(
      { message: "Erro ao excluir task" },
      { status: 500 }
    );
  }
}
