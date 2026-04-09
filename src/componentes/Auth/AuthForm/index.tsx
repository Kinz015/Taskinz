"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, registerSchema } from "@/lib/validatros/auth";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  // 🔥 valida campo individual ao sair
  function validateField(field: keyof FieldErrors) {
    const schema = mode === "login" ? loginSchema : registerSchema;

    const payload =
      mode === "login" ? { email, password } : { name, email, password };

    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      const errorForField = parsed.error.issues.find(
        (err) => err.path[0] === field,
      );

      setFieldErrors((prev) => ({
        ...prev,
        [field]: errorForField?.message,
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🔥 valida confirm password
    if (mode === "register" && password !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "As senhas não coincidem",
      }));
      setLoading(false);
      return;
    }

    const schema = mode === "login" ? loginSchema : registerSchema;

    const payload =
      mode === "login" ? { email, password } : { name, email, password };

    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      const errors: FieldErrors = {};

      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FieldErrors;
        errors[field] = err.message;
      });

      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro na autenticação");
        setLoading(false);
        return;
      }

      if (mode === "login") {
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);

              if (touched.name) {
                const result = registerSchema.shape.name.safeParse(value);

                setFieldErrors((prev) => ({
                  ...prev,
                  name: result.success
                    ? undefined
                    : result.error.issues[0].message,
                }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, name: true }));
              validateField("name");
            }}
            className={`w-full rounded-md border px-3 py-2 text-sm
          ${
            fieldErrors.name
              ? "border-red-500"
              : touched.name && !fieldErrors.name && name
                ? "border-green-600"
                : "border-gray-300"
          }
          focus:outline-none`}
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
          )}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          value={email}
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);

            if (touched.email) {
              const result = loginSchema.shape.email.safeParse(value);

              setFieldErrors((prev) => ({
                ...prev,
                email: result.success
                  ? undefined
                  : result.error.issues[0].message,
              }));
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, email: true }));
            validateField("email");
          }}
          className={`w-full rounded-md border px-3 py-2 text-sm
          ${
            fieldErrors.email
              ? "border-red-500"
              : touched.email && !fieldErrors.email && email
                ? "border-green-600"
                : "border-gray-300"
          }
          focus:outline-none`}
        />
        {touched.email && fieldErrors.email && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Senha
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);

              if (touched.password) {
                const schema = mode === "login" ? loginSchema : registerSchema;
                const result = schema.shape.password.safeParse(value);

                setFieldErrors((prev) => ({
                  ...prev,
                  password: result.success
                    ? undefined
                    : result.error.issues[0].message,
                }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, password: true }));
              validateField("password");
            }}
            className={`w-full rounded-md border px-3 py-2 pr-10 text-sm
              ${
                fieldErrors.password
                  ? "border-red-500"
                  : touched.password && !fieldErrors.password && password
                    ? "border-green-600"
                    : "border-gray-300"
              }
              focus:outline-none`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-0 inset-y-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        {touched.password && fieldErrors.password && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
        )}
      </div>

      {mode === "register" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Confirmar senha
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmPassword(value);

                if (touched.confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword:
                      value && value !== password
                        ? "As senhas não coincidem"
                        : undefined,
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, confirmPassword: true }));

                if (password !== confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: "As senhas não coincidem",
                  }));
                }
              }}
              className={`w-full rounded-md border px-3 py-2 pr-10 text-sm
              ${
                fieldErrors.confirmPassword
                  ? "border-red-500"
                  : touched.confirmPassword &&
                      !fieldErrors.confirmPassword &&
                      confirmPassword
                    ? "border-green-600"
                    : "border-gray-300"
              }
              focus:outline-none`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-0 inset-y-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>

          {touched.confirmPassword && fieldErrors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-md"
      >
        {loading
          ? mode === "login"
            ? "Entrando..."
            : "Cadastrando..."
          : mode === "login"
            ? "Entrar"
            : "Cadastrar"}
      </button>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <div className="text-center text-sm">
        {mode === "login" ? (
          <Link href="/register">
            Não tem conta?{" "}
            <span className="text-blue-500 hover:underline hover:text-blue-600">
              Criar agora
            </span>
          </Link>
        ) : (
          <Link href="/login">
            Já possui conta?{" "}
            <span className="text-blue-500 hover:underline hover:text-blue-600">
              Entrar
            </span>
          </Link>
        )}
      </div>
    </form>
  );
}
