"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
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
import { authClient } from "@/lib/auth-client";
import { getInitials } from "../utils";
import { toast } from "sonner";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = useMemo(() => {
    if (isPending || !session) return null;
    return {
      name: session.user.name as string,
      email: session.user.email as string,
      avatar: session.user.image as string,
    };
  }, [isPending, session]);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/");
    }
  }, [isPending, user, router]);

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
            router.replace("/");
          },
        },
      });
    } catch {
      toast.error("Failed to signOut");
    } finally {
      setIsSignOutDialogOpen(false);
    }
  };

  if (isPending || !user) {
    return "loading...";
  }

  if (!user && !isPending) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOutClick}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
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
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
