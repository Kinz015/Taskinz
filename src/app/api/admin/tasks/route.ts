import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, TaskStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await requireAuth();

  // ✅ proteção obrigatória
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);

  const statusParam = searchParams.get("status");
  const sort = searchParams.get("sort");
  const rawOrder = searchParams.get("order");
  const order: Prisma.SortOrder = rawOrder === "asc" ? "asc" : "desc";

  const where: Prisma.TaskWhereInput = {
    ...(statusParam &&
      Object.values(TaskStatus).includes(statusParam as TaskStatus) && {
        status: statusParam as TaskStatus,
      }),
  };

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
      author: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(tasks);
}
