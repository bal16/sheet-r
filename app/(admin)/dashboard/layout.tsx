import { redirect } from "next/navigation";
import { type CSSProperties } from "react";

import { AppSidebar } from "@/features/admin/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ensureAuthorized } from "@/app/actions/helper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session: unknown;
  let errorCode: number | undefined;
  const knownErrors: Record<number, string> = {
    401: "unauthorized",
    403: "forbidden",
  };
  try {
    session = await ensureAuthorized();
  } catch (error) {
    if (error instanceof Error) {
      errorCode = error.cause as number;
      session = null;
    }
  }

  if (!session && errorCode) {
    redirect(`/?error=${knownErrors[errorCode] || "unauthorized"}`);
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
