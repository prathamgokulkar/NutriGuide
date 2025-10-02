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
    async signIn({ user, account }) {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/get-or-create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, name: user.name }),
        });

        if (!res.ok) return false;
        
        const profileData = await res.json();
        user.profile = profileData; 
        return true;
      } catch (error) {
        console.error("Error connecting to FastAPI backend:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) { 
        token.fastapi_id = user.profile.id;
        token.onboardingComplete = user.profile.onboarding_complete;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.fastapi_id;
      session.user.onboardingComplete = token.onboardingComplete;
      return session;
    },
  },
};
