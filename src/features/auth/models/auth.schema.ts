import { z } from 'zod';

const email = z.string().trim().min(1, 'Введите email').email('Некорректный email');

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Введите пароль'),
});

export const signUpSchema = z
  .object({
    email,
    password: z.string().min(8, 'Пароль должен быть не короче 8 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
