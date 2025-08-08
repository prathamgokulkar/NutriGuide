import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./connectDB";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No User found with this email");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
          };
        } catch (err) {
          console.error("Authorization error:", err);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      await connectDB();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image, // optional
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};
