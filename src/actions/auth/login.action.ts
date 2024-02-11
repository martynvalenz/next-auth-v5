'use server';
import * as z from 'zod';
import {LoginSchema} from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/actions/user/user.actions';
import { generateVerificationToken } from '@/actions/user/generate-token.actions';
import { sendVerificationEmail } from '@/actions/mail/send-verification-token';

export const login = async(data:z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if(!validatedData.success){
    return {
      success:false,
      message:'Invalid email or password'
    }
  }

  const {email,password} = validatedData.data;

  const user = await getUserByEmail(email);

  if(!user || !user.email || !user.password){
    return {
      success:false,
      message:'Invalid credentials'
    }
  }

  if(!user.emailVerified){
    const token = await generateVerificationToken(email);
    await sendVerificationEmail(email,token!);

    return ({
      success:true,
      message:'You need to verify your email to Sign In. Check your inbox for a link to verify your email.'
    })
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    });
  } 
  catch (error) {
    if(error instanceof AuthError){
      switch(error.type){
        case 'CredentialsSignin':
          return {
            success:false,
            message:'Invalid credentials'
          }
        default:
          return {
            success:false,
            message:'Something went wrong. Please try again later.'
          }
      }
    }
    throw error;
  }
}
