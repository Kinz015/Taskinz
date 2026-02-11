import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProjectRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(); // 🔐 COOKIE AUTH

    const body = await req.json();
    const { title, description, imageUrl } = body;
    if (!title) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        ownerId: user.id,

        // já cria o membro OWNER automaticamente
        members: {
          create: {
            userId: user.id,
            role: ProjectRole.OWNER,
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, imageUrl: true },
            },
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    return NextResponse.json(
      { error: "Não foi possivel criar projeto" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const user = await requireAuth();

    // lista projetos que o usuário é membro (OWNER/ADMIN/MEMBER)
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId: user.id },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, imageUrl: true },
            },
          },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error("LIST PROJECTS ERROR:", err);
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
}
