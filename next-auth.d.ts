import {NextAuth, User} from "next-auth"
import {JWT} from "next-auth/jwt";
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User{
    accessToken:string
    refreshToken: string
    id: string
    role: string
    isActive: string
    expiredAt: number
  }
  interface Session{
    user?: User
    error?: string 
  }
}

declare module "next-auth/jwt"{
  interface JWT{
    user: User
    error?: string
  }
}