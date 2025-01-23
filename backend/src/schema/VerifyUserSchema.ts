import e from 'express'
import z from  'zod'

export const VerifyUserSchema = z.object({
    email : z.string().email('Invalid email'),
    verificationCode : z.string().length(6, "Verification code must be 6 characters long")
});