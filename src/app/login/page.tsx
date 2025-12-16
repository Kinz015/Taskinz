"use client";

export default function LoginForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // aqui vai o fetch para /api/auth/login
  }

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
        Entrar no Taskinz
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            placeholder="Seu nome"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
          />
        </div>

        {/* Senha */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            placeholder="••••••••"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-green-600 py-2 text-sm font-semibold text-white
                     transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600/30"
        >
          Entrar
        </button>
      </form>

      {/* Links */}
      <div className="mt-4 flex flex-col gap-2 text-center text-sm text-gray-600">
        <a href="#" className="hover:text-green-600">
          Esqueci minha senha
        </a>
        <a href="/register" className="font-medium hover:text-green-600">
          Criar conta
        </a>
      </div>
    </div>
  );
}
