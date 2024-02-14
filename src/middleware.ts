import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from '@/routes'

const {auth} = NextAuth(authConfig);

export default auth((req) => {
  // console.log(req.nextUrl.pathname)
  const {nextUrl} = req;
  const isLoggedIn = !!req.auth;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
  if (isApiAuthRoute) {
    return;
  }

  if(isAuthRoute){
    if(isLoggedIn){
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if(!isLoggedIn && !isPublicRoute){
    let callbackUrl = nextUrl.pathname;
    if(nextUrl.search){
      callbackUrl += nextUrl.search;
    }
    const encondedCallUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(
      `/auth/login?${encondedCallUrl}`, 
      nextUrl
    ));
  }

  return;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}