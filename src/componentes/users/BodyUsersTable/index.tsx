"use client";

import { AuthUser } from "@/types/auth";
import { EllipsisIcon } from "lucide-react";

type BodyUsersTableProps = {
  users: AuthUser[];
};
export default function BodyUsersTable({ users }: BodyUsersTableProps) {
  console.log(users);
  return (
    <div className="max-h-[calc(100vh-164px)] md:max-h-[calc(100vh-208px)] xl:max-h-[calc(100vh-256px)] overflow-y-scroll scrollbar-hidden">
      {/* 🖥 DESKTOP */}
      <table className="hidden md:table px-2 w-full border-separate border-spacing-y-2">
        <colgroup>
          <col className="min-w-[60] w-[60] max-w-[60]" />
          <col className="w-[250]" />
          <col className="w-[250]" />
          <col className="w-[100]" />
          <col className="w-[150]" />
          <col className="w-[100]" />
          <col className="w-[150]" />
          <col className="w-[150]" />
          <col className="w-[150]" />
          <col className="w-[150]" />
          <col className="min-w-[60] w-[60] max-w-[60]" />
        </colgroup>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="bg-[#E5E5E5]">
              <td className="rounded-l-lg text-center py-4 font-semibold">
                {index + 1}
              </td>

              <td className="py-4 text-left">
                <div className="flex items-center gap-3">
                  {user.imageUrl ? (
                    // Avatar
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.imageUrl}
                      alt={user.name ?? "Usuário"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    // Fallback (bolinha com inicial)
                    <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-sm font-semibold">
                      {(user.name?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
                    </div>
                  )}

                  <span className="max-w-[200] truncate">
                    {user.name ?? "Sem nome"}
                  </span>
                </div>
              </td>
              <td className="py-4 text-left">{user.email}</td>

              <td className="py-4 text-center">
                {user.isAdmin ? "Admin" : "User"}
              </td>

              <td className="py-4 text-center">5</td>

              <td className="py-4 text-center">6</td>

              <td className="py-4 text-center">7</td>
              <td className="py-4 text-center">8</td>

              <td className="py-4 text-center">9</td>

              <td className="py-4 text-center">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              <td className="rounded-r-lg">
                <EllipsisIcon className="m-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
