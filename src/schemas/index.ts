import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string({
    invalid_type_error: 'Email address is required',
  }).email({
    message: 'Please enter a valid email address',
  }),
  password: z.string({
    invalid_type_error: 'Please enter a password',
  }).min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string({
    invalid_type_error: 'Please enter a code',
  })),
});

export const RegisterSchema = z.object({
  email: z.string({
    invalid_type_error: 'Email address is required',
  }).email({
    message: 'Please enter a valid email address',
  }),
  password: z.string({
    invalid_type_error: 'Please enter a password',
  }).min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  name: z.string({
    invalid_type_error: 'Name is required',
  }).min(1, {
    message: 'Name is required',
  }),
});


export const ResetSchema = z.object({
  email: z.string({
    invalid_type_error: 'Email address is required',
  }).email({
    message: 'Please enter a valid email address',
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string({
    invalid_type_error: 'Please enter a password',
  }).min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});