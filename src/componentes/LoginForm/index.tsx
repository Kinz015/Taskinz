"use client";

export default function LoginForm() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // fetch('/api/auth/login')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Senha" required />
      <button type="submit">Entrar</button>
    </form>
  );
}