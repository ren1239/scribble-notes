"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, error, isLoading } = trpc.AuthCallback.useQuery();

  useEffect(() => {
    if (data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [data, origin, router]);

  useEffect(() => {
    if (error?.data?.code === "UNAUTHORIZED") {
      router.push("/sign-in");
    }
  }, [error, router]);

  return (
    <div className="w-full mt-24 flex justify-center ">
      <div className="flex flex-col items-center dash-2">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
        <h3>Setting up your account.</h3>
        <p>You will be redirected automatically</p>
      </div>
    </div>
  );
}
