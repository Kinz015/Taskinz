import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const authUser = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authUser = await requireAuth();

    const body = await req.json();

    const {
      name,
      imageUrl,
      currentPassword,
      newPassword,
    } = body as {
      name?: string;
      imageUrl?: string | null;
      currentPassword?: string;
      newPassword?: string;
    };

    // validações básicas
    if (name !== undefined && !name.trim()) {
      return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    }

    // pega hash atual pra validar troca de senha
    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { id: true, passwordHash: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const data: {
      name?: string;
      imageUrl?: string | null;
      passwordHash?: string;
    } = {};

    // atualiza nome
    if (name !== undefined) {
      data.name = name.trim();
    }

    // atualiza imagem (se vier "")
    if (imageUrl !== undefined) {
      const trimmed = typeof imageUrl === "string" ? imageUrl.trim() : null;
      data.imageUrl = trimmed && trimmed.length > 0 ? trimmed : null;
    }

    // troca de senha (opcional)
    const wantsPasswordChange = !!(currentPassword || newPassword);

    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Informe senha atual e nova senha" },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Nova senha deve ter no mínimo 6 caracteres" },
          { status: 400 }
        );
      }

      const ok = await bcrypt.compare(currentPassword, dbUser.passwordHash);
      if (!ok) {
        return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
      }

      data.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // se não tem nada pra atualizar
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const updated = await prisma.user.update({
      where: { id: authUser.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, user: updated }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
}
