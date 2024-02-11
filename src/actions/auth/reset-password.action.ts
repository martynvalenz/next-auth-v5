'use server';

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from '@/actions/user/user.actions';
import { z } from "zod";
import { generatePasswordResetToken } from "../user/generate-token.actions";
import { sendPasswordResetEmail } from "../mail/send-verification-token";

export const resetePassword = async(formData:z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(formData);

  if(!validatedFields.success){
    return {
      success:false,
      message:'Invalid email address'
    }
  }

  const {email} = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser){
    return {
      success:false,
      message:'Email not found!'
    }
  }

  const resetToken = await generatePasswordResetToken(email);
  if(!resetToken){
    return {
      success:false,
      message:'Failed to generate reset token'
    }
  }

  await sendPasswordResetEmail(resetToken.email!,resetToken.token!);

  return {
    success:true,
    message:'Reset password link sent to your email'
  }
}