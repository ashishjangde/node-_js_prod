import z from 'zod';

export const SignInSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .max(15, "Password must be at most 15 characters long")
});