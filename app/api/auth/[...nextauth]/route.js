import NextAuth from "next-auth"
import LineProvider from "next-auth/providers/line"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/config/prisma"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    LineProvider({
      clientId: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
      clientSecret: process.env.LINE_CHANNEL_SECRET,
      authorization: {
        params: {
          scope: 'profile openid email',
          bot_prompt: 'normal'
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          userId: profile.sub,
          displayName: profile.name,
          pictureUrl: profile.picture,
          isAdmin: false,
          statusMessage: null,
          password: null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      session.user.userId = user.userId
      session.user.displayName = user.displayName
      session.user.pictureUrl = user.pictureUrl
      session.user.isAdmin = user.isAdmin ?? false
      session.user.statusMessage = user.statusMessage

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" })
      
      const cookieStore = cookies()
      cookieStore.set("token", token, { 
        httpOnly: true, 
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
      })

      cookieStore.set("userId", user.id.toString(), { 
        httpOnly: true, 
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60
      })

      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
})

export { handler as GET, handler as POST }
