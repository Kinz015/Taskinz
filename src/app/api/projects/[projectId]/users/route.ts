import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ projectId: string }>;
};

export async function GET(req: Request, { params }: Params) {
  const { projectId } = await params;
  const { searchParams } = new URL(req.url);

  const sort = searchParams.get("sort") ?? "createdAt";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const projectIdNumber = Number(projectId);

  if (Number.isNaN(projectIdNumber)) {
    return NextResponse.json({ error: "projectId inválido" }, { status: 400 });
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
  return NextResponse.json(users);
}
