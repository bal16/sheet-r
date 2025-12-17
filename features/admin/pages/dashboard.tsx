import { AppSidebar } from "@/features/admin/components/app-sidebar";
import { SectionCards } from "@/features/admin/components/section-cards";
import { SiteHeader } from "@/features/admin/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconPlayerPlay } from "@tabler/icons-react";

export default function DashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader name="Overview" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Ready to Watch Section - Takes up more space */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Ready to Watch</CardTitle>
                    <CardDescription>
                      Downloaded movies waiting for your review.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Dune: Part Two",
                          size: "14.2 GB",
                          date: "Today",
                        },
                        {
                          title: "Poor Things",
                          size: "8.4 GB",
                          date: "Yesterday",
                        },
                        {
                          title: "The Boy and the Heron",
                          size: "6.1 GB",
                          date: "2 days ago",
                        },
                      ].map((movie, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{movie.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {movie.size} • Downloaded {movie.date}
                            </span>
                          </div>
                          <Button size="sm" className="gap-2">
                            <IconPlayerPlay className="size-4" />
                            Review Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity Section */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates from your downlist.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {[
                        {
                          text: "Added 'Dune' to Downlist",
                          time: "2 hours ago",
                        },
                        {
                          text: "Finished downloading 'Poor Things'",
                          time: "5 hours ago",
                        },
                        {
                          text: "Reviewed 'Oppenheimer'",
                          time: "Yesterday",
                        },
                        {
                          text: "Created event 'Horror Marathon'",
                          time: "2 days ago",
                        },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center">
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {activity.text}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
