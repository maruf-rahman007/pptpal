import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import prisma from './prisma'
import { checkRoomAccess } from './roomAuth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        roomId: { label: "Room ID", type: "text" },
        password: { label: "Password", type: "password" },
        studentId: { label: "Student ID", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { roomId, password, studentId } = credentials;

        if (!roomId || !password) {
            return null;
        }

        const room = await checkRoomAccess({ roomId, password, studentId });
        if (!room) return null;

        console.log("Return values:", room);

        return { id: room.id, title: room.title, roomname: room.roomname };
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

        let role = "guest"

        if (account.provider === "google") {
          role = "user"
        }

        if (account.provider === "credentials") {
          role = "guest"
        }

        return {
          ...token,
          id: user.id,
          accessToken: account.access_token,
          role,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id
      }
      if (token?.role) {
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account }) {
      console.log(user, account)
      if (account?.provider === "credentials") {
        return true
      }
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              id: user.id,
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
