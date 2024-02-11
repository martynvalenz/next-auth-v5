'use server';
import * as z from 'zod';
import {RegisterSchema} from '@/schemas';
import bcrypt from 'bcryptjs';
import {db} from '@/lib/db';
import { getUserByEmail } from '../user/user.actions';
import { generateVerificationToken } from '../user/generate-token.actions';
import { sendVerificationEmail } from '../mail/send-verification-token';

export const register = async(data:z.infer<typeof RegisterSchema>) => {
  try {
    const validatedData = RegisterSchema.safeParse(data);

    if(!validatedData.success){
      return {
        success:false,
        message:'Invalid email or password'
      }
    }

    const {name, email, password} = validatedData.data;

    const existingUser = await getUserByEmail(email);

    if(existingUser){
      return {
        success:false,
        message:'User with this email already exists'
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data:{
        name,
        email,
        password:hashedPassword
      }
    });

    const token = await generateVerificationToken(email);

    if(!token){
      return {
        success:false,
        message:'Failed to generate verification token'
      }
    }

    await sendVerificationEmail(email,token);

    return {
      success:true,
      message:'Email sent! Check your inbox for a link to reset your password.'
    }
  } catch (error) {
    console.log(error)
    return {
      success:false,
      message:'Something went wrong. Please try again later.'
    } 
  }
}