import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "../lib/mongodb";
import TempUser from "../models/TempUser";
import User from "../models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) return true;

        const tempUser = await TempUser.findOne({ email: user.email });
        if (!tempUser) {
          const [firstName, ...lastNameParts] = user.name?.split(" ") || [""];
          const lastName = lastNameParts.join(" ") || "";

          await TempUser.create({
            firstName,
            lastName,
            email: user.email,
            picture: user.image || "",
            googleId: account.providerAccountId,
            isVerified: true,
            profileCompleted: false,
            userType: "customer",
            google: true,
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = session.user || ({} as { name: string; email: string; image: string });
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.image = token.picture as string;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/profile-setup")) return `${baseUrl}${url}`;
      if (url) return url;
      return baseUrl;
    },
  },
};