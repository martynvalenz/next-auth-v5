'use client';

import {useCallback, useEffect, useState} from 'react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import {MoonLoader} from 'react-spinners';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-succes';
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/actions/user/new-verification.action';

export const VerificationForm = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const onSubmit = useCallback(() => {
    if(!token){
      setError('Invalid token');
      return;
    }
    newVerification(token)
    .then((data) => {
      if(!data?.success){
        setError(data?.message!);
        setLoading(false);
        return;
      }
      setSuccess(data.message);
      setLoading(false);
    })
  },[token])

  useEffect(() => {
    setLoading(true);
    setError('');
    setSuccess('');
    setTimeout(() => {
      onSubmit();
    }, 1000);
  },[token]);

  return (
    <CardWrapper
      headerLabel="Create a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <div className="flex items-center justify-center w-full">
        {
          loading && <MoonLoader color="#3663d6" />
        }
      </div>
      <FormSuccess message={success} />
      <FormError message={error} />
    </CardWrapper>
  )
}
