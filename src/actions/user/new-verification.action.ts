'use server';
import { db } from "@/lib/db";
import { deleteVerificationToken, getVerificationTokenByToken } from "@/actions/tokens/token.actions";
import { getUserByEmail } from "@/actions/user/user.actions";

export const newVerification = async(token:string) => {
  try {
    const existingToken = await getVerificationTokenByToken(token);

    if(!existingToken){
      return {
        success:false,
        message:'Token does not exist'
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
        message:'Email does not exist'
      }
    }

    await db.user.update({
      where:{id:existingUser.id},
      data:{
        emailVerified:new Date(),
        email:existingToken.email
      }
    });

    await deleteVerificationToken(existingToken.id);

    return {
      success:true,
      message:'Email verified'
    }  
  } catch (error) {
    console.log(error)
    return {
      success:false,
      message:'Failed to verify email'
    }
  }
}