import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import type { Adapter } from "@auth/core/adapters"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "@/actions/user/user.actions"
import { UserRole } from "@prisma/client"

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
      if(account?.provider !== 'credentials') return true;
      const existingUser = await getUserById(user?.id!);
      // Prevent sign in without email verification
      if(!existingUser?.emailVerified) return false;

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
      return token
    },
    async session({ session, token }) {
      if(token.sub && session.user){
        session.user.id = token.sub;
        // session.user.role = token.role as UserRole;
      }

      return {
        ...session,
        user:{
          ...session.user,
          role: token.role as UserRole
        }
      }
    },
  },
  session: { 
    strategy: "jwt",
    maxAge: 180 * 24 * 60 * 60, // 180 days
  },
  ...authConfig
})