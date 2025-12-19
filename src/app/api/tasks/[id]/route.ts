import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
/**
 * GET /api/tasks/:id
 * Buscar uma task específica
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(); // 🔐 usuário logado
    const taskId = Number(params.id);

    if (isNaN(taskId)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, status, dueAt, assigneeId } = body;

    // 🔍 busca a task para checar ownership
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        authorId: true,
        assigneeId: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        { message: "Task não encontrada" },
        { status: 404 }
      );
    }

    const isAuthor = task.authorId === user.sub;
    const isAssignee = task.assigneeId === user.sub;

    // ❌ não é autor nem assignee
    if (!isAuthor && !isAssignee) {
      return NextResponse.json(
        { message: "Você não tem permissão para editar esta task" },
        { status: 403 }
      );
    }

    // 🧠 regra de domínio
    let data: Prisma.TaskUpdateInput = {};

    if (isAuthor) {
      data = {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueAt !== undefined && {
          dueAt: dueAt ? new Date(dueAt) : null,
        }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(status !== undefined && { status }),
      };
    } else if (isAssignee) {
      if (status === undefined) {
        return NextResponse.json(
          { message: "Assignee só pode alterar o status" },
          { status: 403 }
        );
      }

      data = { status };
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/tasks/[id] erro:", error);
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }
}

/**
 * DELETE /api/tasks/:id
 * Remover uma task
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const taskId = Number(params.id);

    if (isNaN(taskId)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const deleted = await prisma.task.deleteMany({
      where: {
        id: taskId,
        authorId: user.sub, // 🔐 só o autor
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "Você não tem permissão para excluir esta task" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] erro:", error);
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }
}
