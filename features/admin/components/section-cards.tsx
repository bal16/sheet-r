import { IconCalendarEvent, IconDownload, IconStar } from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:gap-8 px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <IconStar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">120</div>
          <p className="text-xs text-muted-foreground">+10 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Downloads
          </CardTitle>
          <IconDownload className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Currently downloading</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Event</CardTitle>
          <IconCalendarEvent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">Ghibli Week - Oct</div>
          <p className="text-xs text-muted-foreground">Starts in 3 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
