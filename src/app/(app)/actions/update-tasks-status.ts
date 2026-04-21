"use server";

import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function updateTaskStatus(taskId: number, status: TaskStatus) {
  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
    },
  });
}
