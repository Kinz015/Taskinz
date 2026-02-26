import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProjectRole } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export async function POST(req: Request) {
  try {
    const user = await requireAuth(); // 🔐 COOKIE AUTH

    const formData = await req.formData();

    const title = (formData.get("title") as string | null)?.trim() ?? "";
    const descriptionRaw = formData.get("description") as string | null;
    const description = descriptionRaw?.trim() || null;

    // tags vem como JSON string no formData
    const tagsRaw = (formData.get("tags") as string | null) ?? "[]";
    const tags = JSON.parse(tagsRaw) as string[];

    // arquivo opcional
    const file = formData.get("file") as File | null;

    if (!title) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 },
      );
    }

    // ✅ Se tiver arquivo, sobe pro Cloudinary e pega URL
    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      // (opcional) validação básica
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Arquivo enviado não é uma imagem." },
          { status: 400 },
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "taskinz/projects",
              resource_type: "image",
            },
            (
              error: UploadApiErrorResponse | undefined,
              result: UploadApiResponse | undefined,
            ) => {
              if (error) return reject(error);
              if (!result)
                return reject(
                  new Error("Upload falhou: sem retorno do Cloudinary."),
                );
              resolve(result);
            },
          );

          stream.end(buffer);
        },
      );

      imageUrl = uploadResult.secure_url ?? null;
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        ownerId: user.id,
        tags: {
          create: tags.map((name: string) => ({ name })),
        },
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
