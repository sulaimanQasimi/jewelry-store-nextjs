import { z } from 'zod'

/** Body for /api/auth/token (login) */
export const TokenLoginSchema = z.object({
  email: z.string().min(1, 'Email or username required').max(255).transform((s) => s.trim()),
  password: z.string().min(1, 'Password required')
})

/** Body for POST /api/users/create */
export const CreateUserSchema = z.object({
  username: z.string().min(1, 'Username required').max(100).transform((s) => s.trim()),
  email: z.string().email('Invalid email').max(255).transform((s) => s.trim()),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['admin', 'user']).optional().default('admin')
})

export type TokenLoginBody = z.infer<typeof TokenLoginSchema>
export type CreateUserBody = z.infer<typeof CreateUserSchema>
