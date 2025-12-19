import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { AuthUser } from "@/types/auth";

export async function getLoggedUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthUser;

    return decoded;
  } catch {
    return null;
  }
}
