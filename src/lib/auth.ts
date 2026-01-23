import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { AuthUser } from "@/types/auth";

export async function getLoggedUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies(); // ✅ AQUI
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded.sub || !decoded.email) return null;

    return {
      id: decoded.sub as string,
      name: decoded.name as string,
      email: decoded.email as string,
      imageUrl: decoded.imageUrl as string,
      isAdmin: decoded.isAdmin as boolean,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getLoggedUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  return user;
}
