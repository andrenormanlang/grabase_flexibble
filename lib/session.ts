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
      console.log("Encoding JWT token:", token);
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

      console.log("Encoded JWT token:", encodedToken);
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      console.log("Decoding JWT token:", token);
      const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;
      console.log("Decoded JWT token:", decodedToken);
      return decodedToken;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;
      console.log("Session callback - email:", email);

      try {
        const data = await getUser(email) as { user?: UserProfile };
        console.log("Session callback - user data:", data);

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
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
      console.log("SignIn callback - user email:", email);

      try {
        const userExists = await getUser(email as string) as { users: UserProfile[] };
        console.log("SignIn callback - user exists:", userExists);

        if (userExists.users.length === 0) {
          console.log("User does not exist. Creating new user.");
          await createUser(user.name as string, email as string, user.image as string);
        } else {
          console.log("User already exists.");
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
  console.log("getCurrentUser - session:", session);
  return session;
}
