import {z} from "zod"

export const signInSchema= z.object({
    identifier: z.string().min(3, 'username must be 3 characters long'),
    password:z.string()
})

