'use client';

import {useState} from 'react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {LoginSchema} from '@/schemas'
import {Input} from '@/components/ui/input'
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
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
import { login } from '@/actions/auth/login.action';
import { useTransition } from 'react';
import Link from 'next/link';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with a different account provider' : '';
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues:{
      email: '',
      password: ''
    }
  });

  const onSubmit = (formData: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      login(formData)
      .then((data) => {
        if(!data?.success){
          form.reset();
          setError(data?.message!);
        }
        else if(data.success){
          setSuccess(data?.message!);
          if(data.twoFactor){
            setShowTwoFactor(true);
          }
        }
      })
      .catch(() => {
        setError('An error occurred. Please try again.')
      })
    });
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account? Register here."
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {
              showTwoFactor &&
              (<>
                <FormField
                  control={form.control}
                  name='code'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Two Factor Code</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} type='text' placeholder='' />
                      </FormControl>
                      <FormMessage>{form.formState.errors.code?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </>)
            }
            {
              !showTwoFactor &&
              (<>
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
                      <Button size="sm" variant="link" asChild className="px-0 font-normal">
                        <Link href='/auth/reset-password'>Forgot password?</Link>
                      </Button>
                      <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </>)
            }
          </div>
          <FormSuccess message={success} />
          <FormError message={error || urlError} />
          <Button type="submit" className='w-full' disabled={isPending}>
            {showTwoFactor ? 'Confirm':'Login'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
