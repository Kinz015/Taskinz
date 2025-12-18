import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

function getCurrentUserId(req: Request): string | null {
  // depois: cookie / session / auth
  return req.headers.get("x-user-id");
}

export async function POST(req: Request) {
  try {
    const userId = getCurrentUserId(req);

    console.log("USER ID RECEBIDO:", userId)

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, dueAt, assigneeId } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueAt: dueAt ? new Date(dueAt) : null,
        status: TaskStatus.pending,

        author: {
          connect: { id: userId },
        },

        ...(assigneeId && {
          assignee: {
            connect: { id: assigneeId },
          },
        }),
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar task" }, { status: 500 });
  }
}
