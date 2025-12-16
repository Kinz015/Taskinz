"use client";

export default function RegisterForm() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // fetch('/api/auth/register')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nome" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Senha" required />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
