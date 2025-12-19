import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { Prisma } from "@prisma/client"

function getCurrentUserId(req: Request): string | null {
  // depois: cookie / session / auth
  return req.headers.get("x-user-id");
}

export async function POST(req: Request) {
  try {
    const userId = getCurrentUserId(req);

    console.log("USER ID RECEBIDO:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, dueAt, status, assigneeId } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 }
      );
    }

    const validStatus = Object.values(TaskStatus).includes(status)
      ? status
      : TaskStatus.pending;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueAt: dueAt ? new Date(dueAt) : null,
        status: validStatus,

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where =
    status && Object.values(TaskStatus).includes(status as TaskStatus)
      ? { status: status as TaskStatus }
      : {};

  const sort = searchParams.get("sort");
  const rawOrder = searchParams.get("order");

  const order: Prisma.SortOrder = rawOrder === "asc" ? "asc" : "desc";

  const orderBy: Prisma.TaskOrderByWithRelationInput =
    sort === "dueAt"
      ? { dueAt: order }
      : sort === "updatedAt"
      ? { updatedAt: order }
      : { createdAt: order };

  const tasks = await prisma.task.findMany({
    where,
    orderBy,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(tasks);
}
