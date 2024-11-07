import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { signIn } from 'next-auth/react';
import prisma from './prisma';

export const NEXT_AUTH = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials, req) {
                console.log("Resp :",credentials);
                // Add logic here to look up the user from the credentials supplied
                const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
          
                if (user) {
                  // Any object returned will be saved in `user` property of the JWT
                  return user
                } else {
                  // If you return null then an error will be displayed advising the user to check their details.
                  return null
          
                  // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
              }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
          })
    ],
    secret:process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, user, token }: any) {
            return session
        },
        async jwt({ token, user, session }: any) {
            return token
        },
        async signIn({ user, account, profile, email, credentials }:any) {
          console.log("User ",user);
          console.log("Account ",account);
          console.log("Profile ",profile);
          console.log("Email ",email);
          console.log("Credentials ",credentials);

          const isUserExist = await prisma.user.findFirst({
            where: {
              email:user.email,
            }
          })
          if (isUserExist) {
            return true;
          } else {
            try {
              const newUser = await prisma.user.create({
                data: {
                  name:user.name,
                  email:user.email,
                  image:user.image
                }
              })
              return true;
            } catch (error) {
              throw new Error("Something Wrong With Data Base")
            }
          }
        }
    },
    pages: {
      signIn: ["/usersignin","roomsignin"]
    }
}