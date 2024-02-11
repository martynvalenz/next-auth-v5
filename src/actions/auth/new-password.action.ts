'use server';

import * as z from 'zod';
import { NewPasswordSchema } from '@/schemas';
import { getPasswordResetTokenByToken } from '../user/reset-password-token';
import { getUserByEmail } from '../user/user.actions';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const newPassword = async (
  formData:z.infer<typeof NewPasswordSchema>,
  token?:string|null
) => {
  if(!token){
    return {
      success:false,
      message:'Missing token'
    }
  }

  const validatedFields = NewPasswordSchema.safeParse(formData);
  if(!validatedFields.success){
    return {
      success:false,
      message:'Invalid data'
    }
  }

  const {password} = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if(!existingToken){
    return {
      success:false,
      message:'Invalid token'
    }
  }

  const hasExpired = new Date() > new Date(existingToken.expires);
  if(hasExpired){
    return {
      success:false,
      message:'Token has expired'
    }
  }

  const existingUser = await getUserByEmail(existingToken.email!);

  if(!existingUser){
    return {
      success:false,
      message:'Email does not exist!'
    }
  }

  const hashedPassword = await bcrypt.hashSync(password, 10);

  await db.user.update({
    where:{
      id:existingUser.id
    },
    data:{
      password:hashedPassword
    }
  })

  await db.passwordResetToken.delete({
    where:{
      id:existingToken.id
    }
  });

  return {
    success:true,
    message:'Password updated'
  }
}