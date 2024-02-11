'use client';

import React from 'react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Input} from '@/components/ui/input'
import * as z from 'zod'
import { Button } from '@/components/ui/button';
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-succes';
import { useTransition } from 'react';
import { RegisterSchema } from '@/schemas';
import { register } from '@/actions/auth/register.action';

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues:{
      email: '',
      password: '',
      name:''
    }
  });

  const onSubmit = (formData: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      register(formData)
      .then((data) => {
        if(!data.success){
          setError(data.message);
          return;
        }
        setSuccess(data.message);
      })
      .catch((error) => {
        console.log(error)
        setError('An error occurred. Please try again.')
      })
    });
  }

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account? Login here."
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} placeholder='John Doe' />
                  </FormControl>
                  <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} type='email' placeholder='john.doe@example.com' />
                  </FormControl>
                  <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} type='password' placeholder='******' />
                  </FormControl>
                  <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button type="submit" className='w-full' disabled={isPending}>
            Sign Up
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
