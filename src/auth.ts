import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import type { Adapter } from "@auth/core/adapters"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "@/actions/user/user.actions"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/actions/tokens/two-factor-confirmation"

export const { 
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages:{
    signIn: '/auth/login',
    // signOut: '/auth/logout',
    error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    newUser: '/auth/register'
  },
  adapter: PrismaAdapter(db) as Adapter,
  events:{
    async linkAccount({user}){
      await db.user.update({
        where:{id:user.id},
        data:{
          emailVerified:new Date()
        }
      })
    }
  },
  callbacks:{
    async signIn({ user, account }) {
      // Allow OAuth withou email verification
      if (account?.provider === "google") {
        return true;
      }
      // if(account?.provider !== 'credentials') return true;
      const existingUser = await getUserById(user?.id!);
      // Prevent sign in without email verification
      if(!existingUser?.emailVerified) return false;
      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user?.id!);

        if(!twoFactorConfirmation){
          return false;
        }

        //* Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where:{
            id:twoFactorConfirmation.id
          }
        });
      }

      return true
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
    async jwt({ token }) {
      if(!token.sub) return token;

      const user = await getUserById(token.sub);
      if(!user) return token;
      
      token.role = user.role;
      token.image = user.image;
      return token
    },
    async session({ session, token }) {
      if(token.sub && session.user){
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole | 'USER';
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 180 * 24 * 60 * 60, // 180 days
  },
  ...authConfig
})