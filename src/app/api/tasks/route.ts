import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

function getCurrentUserId(req: Request): string | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };

    return payload.sub;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const userId = getCurrentUserId(req);

    console.log("USER ID (JWT):", userId);

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

        // ✅ autor vem do token
        author: {
          connect: { id: userId },
        },

        // ✅ assignee opcional
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
