'use client';

import {useState} from 'react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {ResetSchema} from '@/schemas'
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
import { resetePassword } from '@/actions/auth/reset-password.action';

export const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues:{
      email: '',
    }
  });

  const onSubmit = (formData: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      resetePassword(formData)
      .then((data) => {
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
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
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
          </div>
          <FormSuccess message={success} />
          <FormError message={error } />
          <Button type="submit" className='w-full' disabled={isPending}>
            Send email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
