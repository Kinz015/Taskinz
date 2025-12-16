import RegisterForm from "@/componentes/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section>
        <h1>Criar conta</h1>
        <RegisterForm />
      </section>
    </main>
  );
}