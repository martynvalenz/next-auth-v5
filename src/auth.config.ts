import GitHub from "next-auth/providers/github"
import Google from 'next-auth/providers/google'
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"
import bcrypt from "bcryptjs"

import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "./actions/user/user.actions"

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if(!validatedFields.success){
          return null
        }

        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);
        if(!user || !user.password) return null;

        const isValid = await bcrypt.compareSync(password, user.password);
        if(!isValid) return null;

        if(isValid) return user;

        return null;
      }
    }),
    GitHub({
      name:'GitHub',
      clientId:process.env.GITHUB_ID,
      clientSecret:process.env.GITHUB_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      allowDangerousEmailAccountLinking: true
    }),
    Google({
      name:'Google',
      clientId:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      allowDangerousEmailAccountLinking: true
    })
  ],
} satisfies NextAuthConfig