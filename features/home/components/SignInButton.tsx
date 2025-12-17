"use client";

import { Loader2, LogIn, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const SignInButton = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Button
        disabled
        className="bg-indigo-600/50 text-white border border-indigo-500/20"
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <Button
        onClick={() => authClient.signOut()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      onClick={() => authClient.signIn.social({ provider: "google" })}
      className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </Button>
  );
};
