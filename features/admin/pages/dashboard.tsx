import { SectionCards } from "@/features/admin/components/section-cards";
import { SiteHeader } from "@/features/admin/components/site-header";
import { QueueList } from "@/features/admin/components/queue-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getQueue } from "@/app/actions/queue-act";

export default async function DashboardPage() {
  const queueItems = await getQueue();

  return (
    <>
      <SiteHeader name="Overview" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-7">
              {/* Queue Section */}
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Watch Queue</CardTitle>
                  <CardDescription>
                    Manage your watch queue and review movies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QueueList initialItems={queueItems} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
