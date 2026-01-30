import { z } from "zod";

// Common password blocklist (top 100 most common)
const COMMON_PASSWORDS = new Set([
  "password",
  "123456",
  "12345678",
  "qwerty",
  "abc123",
  "monkey",
  "1234567",
  "letmein",
  "trustno1",
  "dragon",
  "baseball",
  "iloveyou",
  "master",
  "sunshine",
  "ashley",
  "bailey",
  "shadow",
  "123123",
  "654321",
  "superman",
  "qazwsx",
  "michael",
  "football",
  "password1",
  "password123",
  "welcome",
  "welcome1",
  "admin",
  "admin123",
  "login",
  "passw0rd",
  "starwars",
  "hello",
  "charlie",
  "donald",
  "password2",
  "qwerty123",
  "aa123456",
  "hunter",
  "hunter2",
]);

// Password validation with enhanced security
const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
    "Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)"
  )
  .refine(
    (pwd) => !COMMON_PASSWORDS.has(pwd.toLowerCase()),
    "This password is too common. Please choose a stronger password."
  )
  .refine(
    (pwd) => !/(.)\1{2,}/.test(pwd),
    "Password cannot contain more than 2 repeated characters in a row"
  )
  .refine(
    (pwd) => !/^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def)/i.test(pwd),
    "Password cannot start with sequential characters"
  );

// Email validation with additional checks
const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email is too short")
  .max(320, "Email is too long")
  .toLowerCase()
  .trim()
  .refine(
    (email) => !email.includes("+"), // Prevent email alias abuse
    "Email aliases with '+' are not allowed"
  );

// Name validation
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .trim()
  .refine(
    (name) => /^[a-zA-Z\s\-']+$/.test(name),
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

// Password reset schema
export const passwordResetSchema = z
  .object({
    token: z.string().min(32, "Invalid reset token"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Password change schema (for logged-in users)
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
