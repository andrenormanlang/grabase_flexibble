import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

import { createUser, getUser } from "./actions";
import { SessionInterface, UserProfile } from "@/common.types";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "hasura",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": token!.sub,
          },
        },
        secret
      );
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;
      return decodedToken;
    },
  },
  callbacks: {
    async session({ session, token }) {
      const email = session?.user?.email as string;
      try {
        const data = await getUser(email) as { users: UserProfile[] };
        const user = data?.users[0];

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...user,
            id: user.id, // Ensure the ID is added to the session
          },
        };
        return newSession;
      } catch (error) {
        console.log("Error retrieving user data:", error);
        return session;
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      const email = user?.email;
      try {
        const userExists = await getUser(email as string) as { users: UserProfile[] };
        if (userExists.users.length === 0) {
          await createUser(user.name as string, email as string, user.image as string);
        }
        return true;
      } catch (error: any) {
        console.log("Error in signIn callback:", error);
        return false;
      }
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as SessionInterface;
  return session;
}
