import LoginForm from "@/componentes/Auth/LoginForm";

export default function LoginPage() {

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
      <h1 className="mb-8 pt-4 text-center text-2xl font-semibold text-gray-900">
        Entrar no Taskinz
      </h1>
      <LoginForm/>
    </div>
  );
}
