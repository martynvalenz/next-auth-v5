'use server'
import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async(email:string,token:string) => {
  try {
    const confirmLink = `${process.env.APP_URL}/auth/verification?token=${token}`;
    
    await resend.emails.send({
      from:`${process.env.EMAIL_SENDER}`,
      to:email,
      subject:'Confirm your email',
      html:`<p>Click <a href="${confirmLink}">here</a> to confirm your email address</p>`
    })
  } 
  catch (error) {
    console.error(error);
    throw new Error('Failed to send verification email');
  }
}

export const sendPasswordResetEmail = async(email:string,token:string) => {
  try {
    const resetLink = `${process.env.APP_URL}/auth/new-password?token=${token}`;
    
    await resend.emails.send({
      from:`${process.env.EMAIL_SENDER}`,
      to:email,
      subject:'Reset your password',
      html:`<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
    })
  } 
  catch (error) {
    console.error(error);
    throw new Error('Failed to send password reset email');
  }
}