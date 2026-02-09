import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { Prisma, TaskStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    if (!user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const sort = searchParams.get("sort");
    const rawOrder = searchParams.get("order");
    const order: Prisma.SortOrder = rawOrder === "asc" ? "asc" : "desc";

    const orderBy: Prisma.UserOrderByWithRelationInput =
      sort === "updatedAt"
        ? { updatedAt: order }
        : sort === "name"
          ? { name: order }
          : sort === "email"
            ? { email: order }
            : { createdAt: order };

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy, // ✅ agora respeita sort/order
    });

    const grouped = await prisma.task.groupBy({
      by: ["authorId", "status"],
      _count: { _all: true },
    });

    const stats = new Map<
      string,
      {
        tasksTotal: number;
        tasksConcluidas: number;
        tasksIniciadas: number;
        tasksAtrasadas: number;
      }
    >();

    for (const row of grouped) {
      const uid = row.authorId;
      if (!uid) continue;

      const entry = stats.get(uid) ?? {
        tasksTotal: 0,
        tasksConcluidas: 0,
        tasksIniciadas: 0,
        tasksAtrasadas: 0,
      };

      const c = row._count._all;

      entry.tasksTotal += c;

      if (row.status === TaskStatus.completed) entry.tasksConcluidas += c;
      if (row.status === TaskStatus.started) entry.tasksIniciadas += c;
      if (row.status === TaskStatus.overdue) entry.tasksAtrasadas += c;

      stats.set(uid, entry);
    }

    const usersWithStats = users.map((u) => ({
      ...u,
      ...(stats.get(u.id) ?? {
        tasksTotal: 0,
        tasksConcluidas: 0,
        tasksIniciadas: 0,
        tasksAtrasadas: 0,
      }),
    }));

    return NextResponse.json(usersWithStats, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
}
