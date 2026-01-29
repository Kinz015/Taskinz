import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TaskStatus } from "@prisma/client";

export async function GET() {
  try {
    const user = await requireAuth();

    if (!user.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

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
      orderBy: { createdAt: "desc" },
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
        tasksEmAndamento: number;
        tasksPendentes: number;
      }
    >();

    for (const row of grouped) {
      const uid = row.authorId;
      if (!uid) continue;

      const entry = stats.get(uid) ?? {
        tasksTotal: 0,
        tasksConcluidas: 0,
        tasksEmAndamento: 0,
        tasksPendentes: 0,
      };

      const c = row._count._all;

      entry.tasksTotal += c;

      if (row.status === TaskStatus.completed) entry.tasksConcluidas += c;
      if (row.status === TaskStatus.in_progress) entry.tasksEmAndamento += c;
      if (row.status === TaskStatus.pending) entry.tasksPendentes += c;

      stats.set(uid, entry);
    }

    const usersWithStats = users.map((u) => ({
      ...u,
      ...(stats.get(u.id) ?? {
        tasksTotal: 0,
        tasksConcluidas: 0,
        tasksEmAndamento: 0,
        tasksPendentes: 0,
      }),
    }));

    return NextResponse.json(usersWithStats, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
}
