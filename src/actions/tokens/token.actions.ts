'use server';
import { db } from '@/lib/db';
import crypto from 'crypto';
import { getTwoFactorTokenByEmail, getTwoFactorTokenByToken } from './two-factor-token';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationCredentialToken.findFirst({
      where: {
        email
      }
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationCredentialToken.findFirst({
      where: {
        token
      }
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
}

export const deleteVerificationToken = async (id: string) => {
  try {
    await db.verificationCredentialToken.delete({
      where: {
        id
      }
    });

    return true;
  } catch (error) {
    return false;
  }
}

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 1000 * 5 * 60); // 5 minutes

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
      await db.twoFactorToken.delete({
        where: {
          id: existingToken.id
        }
      });
    }

    const twoFactorToken = await db.twoFactorToken.create({
      data:{
        email,
        token,
        expires
      }
    })

    return twoFactorToken;
  } catch (error) {
    return null;
  }
}