'use server';
import * as z from 'zod';
import {LoginSchema} from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/actions/user/user.actions';
import { generateVerificationToken } from '@/actions/tokens/generate-token.actions';
import { sendTwoFactorEmail, sendVerificationEmail } from '@/actions/mail/send-verification-token';
import { generateTwoFactorToken } from '../tokens/token.actions';
import { getTwoFactorTokenByEmail } from '../tokens/two-factor-token';
import { db } from '@/lib/db';
import { getTwoFactorConfirmationByUserId } from '../tokens/two-factor-confirmation';

export const login = async(data:z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if(!validatedData.success){
    return {
      success:false,
      message:'Invalid email or password'
    }
  }

  const {email,password,code} = validatedData.data;

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

  if(user.isTwoFactorEnabled && user.email){
    if(code){
      const twoFactorToken = await getTwoFactorTokenByEmail(user.email);
      if(!twoFactorToken){
        return {
          success:false,
          message:'There is no factor code'
        }
      }

      if(twoFactorToken.token !== code){
        return {
          success:false,
          message:'Invalid two factor code'
        }
      }

      const hasExpired = new Date(twoFactorToken.expires).getTime() < new Date().getTime();

      if(hasExpired){
        return {
          success:false,
          message:'Two factor code has expired'
        }
      }

      await db.twoFactorToken.delete({
        where:{
          id:twoFactorToken.id
        }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(user.id!);

      if(existingConfirmation){
        await db.twoFactorConfirmation.delete({
          where:{
            id:existingConfirmation.id
          }
        })
      }
      
      await db.twoFactorConfirmation.create({
        data:{
          userId:user.id!
        }
      });
    }
    else{
      const twoFactorToken = await generateTwoFactorToken(user.email);
      await sendTwoFactorEmail(twoFactorToken?.email!,twoFactorToken?.token!);
  
      return {
        twoFactor:true,
        success:true,
        message:'Two factor code sent to your email'
      }
    }
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
