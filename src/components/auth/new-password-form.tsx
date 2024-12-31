'use client';

import {useState} from 'react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {NewPasswordSchema} from '@/schemas'
import {Input} from '@/components/ui/input'
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { FormError } from '@/components/notifications/form-error';
import { FormSuccess } from '@/components/notifications/form-succes';
import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { newPassword } from '@/actions/auth/new-password.action';

export const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues:{
      password: '',
    }
  });

  const onSubmit = (formData: z.infer<typeof NewPasswordSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      newPassword(formData,token)
      .then((data,) => {
        if(!data?.success){
          setError(data?.message!);
          return;
        }
        setSuccess(data.message);
      })
      .catch(() => {
        setError('An error occurred. Please try again.')
      })
    });
  }

  return (
    <CardWrapper
      headerLabel="Create a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
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
          <FormError message={error } />
          <Button type="submit" className='w-full' disabled={isPending}>
            Confirm new password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
