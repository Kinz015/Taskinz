import { prisma } from "@/lib/prisma";

export async function getTaskForUser(id: number, userId: string) {
  if (!Number.isFinite(id)) return null;

  const task = await prisma.task.findUnique({
    where: { id: id }, // ✅ id é unique
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueAt: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      assigneeId: true,
      author: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });

  if (!task) return null;
  if (task.authorId !== userId) return null; // 🔒 autorização

  return task;
}
