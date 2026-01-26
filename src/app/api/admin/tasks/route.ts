import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { TaskStatus } from "@prisma/client";

type SortKey = "dueAt" | "createdAt" | "updatedAt";
type Order = "asc" | "desc";

const ALLOWED_SORT: SortKey[] = ["dueAt", "createdAt", "updatedAt"];

function parseSort(v: string | null): SortKey {
  return ALLOWED_SORT.includes(v as SortKey) ? (v as SortKey) : "createdAt";
}

function parseOrder(v: string | null): Order {
  return v === "asc" ? "asc" : "desc";
}

function parseStatus(v: string | null): TaskStatus | null {
  if (v === "pending" || v === "in_progress" || v === "completed") return v;
  return null; // null = sem filtro (todas)
}

export async function GET(req: Request) {
  const user = await requireAuth();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = parseStatus(searchParams.get("status"));
  const sort = parseSort(searchParams.get("sort"));
  const order = parseOrder(searchParams.get("order"));

  const tasks = await prisma.task.findMany({
    where: status ? { status } : {},
    orderBy: { [sort]: order },
    include: {
      author: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(tasks);
}
