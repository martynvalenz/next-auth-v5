'use server';
import { db } from '@/lib/db';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
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
    const verificationToken = await db.verificationToken.findFirst({
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
    await db.verificationToken.delete({
      where: {
        id
      }
    });

    return true;
  } catch (error) {
    return false;
  }
}