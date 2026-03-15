import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        return user
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          accessToken: account.access_token
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id
      }
      return session
    },
    async signIn({ user }) {
      console.log("🔍 Google SignIn:", user.id, user.email)
      
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              id: user.id,        // ✅ Google ID: 117782288976783273874
              email: user.email!,
              name: user.name!,
              image: user.image!,
            }
          })
          console.log("✅ CREATED USER:", newUser.id)
        } else {
          console.log("✅ USER EXISTS:", existingUser.id)
        }
        return true
      } catch (error) {
        console.error("🚨 SignIn ERROR:", error)
        return false
      }
    }
  },
  pages: {
    signIn: "/usersignin"
  }
}

export default authOptions
