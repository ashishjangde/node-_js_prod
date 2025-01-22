import z from 'zod'

export const SignupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email('Invalid email'),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string()
    .min(6 , "Password must be at least 6 characters long")
    .max(15, "Password must be at most 15 characters long")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]{6,15}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      
})

