import RegisterForm from "@/componentes/Auth/RegisterForm";
import Image from "next/image";
import logoOnly from "@/assets/TaskinzLogoOnly.png";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">
      <Image
        src={logoOnly}
        alt="Taskinz"
        width={56}
        height={56}
        className="mx-auto mb-3 pt-4"
      />
      <h1 className="mb-8 pt-4 text-center text-2xl font-semibold text-gray-900">
        Criar conta no Taskinz
      </h1>
      <RegisterForm />
    </div>
  );
}
