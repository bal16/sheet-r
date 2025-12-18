"use client";

import { Loader2, LogIn, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const SignInButton = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      toast.error("You need to be signed in to access that page");
      router.replace("/");
    }
  }, [searchParams, router]);

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const handleSignOutClick = () => {
    setIsSignOutDialogOpen(true);
  };

  const confirmSignOut = async () => {
    try {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error("Failed to signOut");
    } finally {
      setIsSignOutDialogOpen(false);
    }
  };

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
      <>
        <Button
          onClick={handleSignOutClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
        <AlertDialog
          open={isSignOutDialogOpen}
          onOpenChange={setIsSignOutDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will signOut and remove your current session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmSignOut}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                SignOut
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <Button
      onClick={() =>
        authClient.signIn.social(
          {
            provider: "google",
            callbackURL: "/dashboard",
          },
          {
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
          }
        )
      }
      className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </Button>
  );
};
