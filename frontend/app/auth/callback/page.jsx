"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      // Still fetching session data
      return;
    }

    if (status === "authenticated") {
      if (session.user.onboardingComplete) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }

    if (status === "unauthenticated") {
        router.push("/login");
    }

  }, [session, status, router]);

  return <div>Loading...</div>; 
}