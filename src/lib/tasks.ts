import { prisma } from "@/lib/prisma";

export async function getTaskForUser(taskId: number, userId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueAt: true,
      createdAt: true,
      updatedAt: true,
      assigneeId: true,
      authorId: true,
      author: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}
