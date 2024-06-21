import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string({ message: 'Password must be a string' }),
});

export type UserLoginDto = z.infer<typeof loginSchema>;
