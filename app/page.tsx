"use client";

import { authClient } from "@/libs/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {session ? (
        <Card className="w-87.5">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              You are signed in as {session.user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => authClient.signOut()}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-87.5">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Sign in to your account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => authClient.signIn.social({ provider: "google" })}
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
