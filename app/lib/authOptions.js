import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/connectDB";
import bcrypt from "bcryptjs";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[authorize] called with:", credentials);
        try {
          await connectDB();
          console.log("[authorize] DB connected");
          const user = await User.findOne({ email: credentials.email });
          console.log("[authorize] User found:", user);
          if (!user) throw new Error("No User found with this email");

          const isPasswordVaild = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("[authorize] Password valid:", isPasswordVaild);
          if (!isPasswordVaild) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (err) {
          console.error("[authorize] error:", err);
          throw err;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      console.log("[signIn callback] user:", user);
      try {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        console.log("[signIn callback] existingUser:", existingUser);
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
          console.log("[signIn callback] User created");
        }
        return true;
      } catch (err) {
        console.error("[signIn callback] error:", err);
        return false;
      }
    },
    async jwt({ token, user }) {
      console.log("[jwt callback] token:", token, "user:", user);
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("[session callback] session:", session, "token:", token);
      session.user.id = token.id;
      return session;
    },
  },
};
