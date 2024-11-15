 import {z} from 'zod'
 
 export const usernameValidation = z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[A-Za-z0-9_]+$/,"Username must not contain speacial characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email : z.string().email({message: 'invalid email address' }),
    password: z.string().min(6,{message: 'Password must be at least 8 characters long'}).max(20, {message:'Password must be at most 20 characters long'})
})