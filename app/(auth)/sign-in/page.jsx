"use client";

import SignInPage from "@/components/Login/SigninPage";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function page() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      console.log("Session expired");
      toast.error("Session expired — please sign in again.");
    }
  }, [searchParams]);

  return (
    <div>
      <SignInPage />
    </div>
  );
}
