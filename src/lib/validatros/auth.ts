import { z } from "zod";

export const emailSchema = z
  .string()
  .email("E-mail inválido");

export const passwordSchema = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Za-z]/, "Senha deve conter ao menos uma letra")
  .regex(/\d/, "Senha deve conter ao menos um número")
  .regex(/[^A-Za-z0-9]/, "Senha deve conter ao menos um caractere especial")
  .refine((val) => !/\s/.test(val), {
    message: "Senha não pode conter espaços",
  });

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha é obrigatória"),
});