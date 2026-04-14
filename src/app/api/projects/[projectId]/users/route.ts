import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ projectId: string }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const user = await requireAuth();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { projectId } = await params;
    const projectIdNumber = Number(projectId);

    if (Number.isNaN(projectIdNumber)) {
      return NextResponse.json(
        { error: "projectId inválido" },
        { status: 400 },
      );
    }

    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId: projectIdNumber,
        userId: user.id,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const sort = searchParams.get("sort") ?? "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    if (Number.isNaN(projectIdNumber)) {
      return NextResponse.json(
        { error: "projectId inválido" },
        { status: 400 },
      );
    }

    const members = await prisma.projectMember.findMany({
      where: {
        projectId: projectIdNumber,
      },
      include: {
        user: true,
      },
      orderBy: {
        user: {
          [sort]: order,
        },
      },
    });
    const users = members.map((member) => member.user);

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectIdNumber,
      },
      select: {
        id: true,
        status: true,
        authorId: true,
        assigneeId: true,
      },
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

    for (const u of users) {
      stats.set(u.id, {
        tasksTotal: 0,
        tasksConcluidas: 0,
        tasksIniciadas: 0,
        tasksAtrasadas: 0,
      });
    }

    for (const task of tasks) {
      const relatedUserIds = new Set<string>();

      if (task.authorId) relatedUserIds.add(task.authorId);
      if (task.assigneeId) relatedUserIds.add(task.assigneeId);

      for (const uid of relatedUserIds) {
        const entry = stats.get(uid);
        if (!entry) continue; // ignora se o usuário não estiver no projeto

        entry.tasksTotal += 1;

        if (task.status === TaskStatus.completed) {
          entry.tasksConcluidas += 1;
        }

        if (task.status === TaskStatus.started) {
          entry.tasksIniciadas += 1;
        }

        if (task.status === TaskStatus.overdue) {
          entry.tasksAtrasadas += 1;
        }

        stats.set(uid, entry);
      }
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
