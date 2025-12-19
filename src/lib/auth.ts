
import jwt from "jsonwebtoken";

type JwtPayload = {
  sub: string;
  name?: string;
  email?: string;
};

export function getLoggedUser(): JwtPayload | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}
