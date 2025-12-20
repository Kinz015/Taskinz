import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1f1f1f] px-6 text-center text-white">
      <h1 className="text-7xl font-bold text-red-500">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">Página não encontrada</h2>

      <p className="mt-2 max-w-md text-sm text-gray-400">
        A página que você tentou acessar não existe, foi movida ou você não tem
        permissão para visualizá-la.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-red-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-600"
      >
        Voltar para tarefas
      </Link>
    </main>
  );
}
