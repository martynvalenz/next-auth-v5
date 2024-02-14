'use server';
import { db } from "@/lib/db";
import {v4 as uuid} from 'uuid';
import { getVerificationTokenByEmail } from "@/actions/tokens/token.actions";
import { getPasswordResetTokenByEmail } from "@/actions/user/reset-password-token";

export const generateVerificationToken = async (email: string) => {
  try {
    const token = await uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
      await db.verificationCredentialToken.delete({
        where:{
          id:existingToken.id
        }
      });
    }

    const verificationToken = await db.verificationCredentialToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    return verificationToken.token;
  } catch (error) {
    return null;
  }
}

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = await uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken){
      await db.passwordResetToken.delete({
        where:{
          id:existingToken.id
        }
      });
    }

    const resetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    return resetToken;
  } catch (error) {
    console.log(error)
    return null;
  }
}