"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  }, [user, isInitialized, router]);

  // Show loading state while checking auth
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
    </div>
  );
}