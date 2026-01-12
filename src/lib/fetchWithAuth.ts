import { headers } from "next/headers";

export async function fetchWithAuth(input: string, init: RequestInit = {}) {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  return fetch(input, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.headers || {}),
      cookie,
    },
  });
}