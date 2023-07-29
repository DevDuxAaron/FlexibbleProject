import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google'
import jsonwebtoken  from "jsonwebtoken";
import { JWT } from 'next-auth/jwt'
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from "./actions";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        })
    ],
    // jwt: {
    //     encode: ({ secret, token }) => {},
    //     decode: async ({ secret, token }) => {},
    // },
    theme: {
        colorScheme: 'light',
        logo: '/logo.png'
    },
    callbacks: {
        async session({ session }){
            const email = session?.user?.email as string

            try {
                const data = await getUser(email) as { user? : UserProfile }

                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...data?.user
                    }
                }
                return newSession
            } catch (error) {
                console.error(error);
                return session
            }
        },
        async signIn({ user }: { user: AdapterUser | User}) {
            try {
                // get the user if they exist
                const userExists = await getUser(user?.email as string) as { user?: UserProfile}

                // if they don't, create them
                if (!userExists.user) {
                    await createUser(
                        user.name as string,
                        user.email as string,
                        user.image as string
                    )
                }
                // return true if they exist or were created
                return true
            } catch (error: any) {
                console.error(error);
                return false
            }
        },
    }
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions) as SessionInterface

    return session
}

// return a Google user
// name, email, avartarUrl ->
// projects, description, githubUrl. linkedinUrl ...