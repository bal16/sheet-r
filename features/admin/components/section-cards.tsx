"use client";

import { useMemo } from "react";
import { IconCalendarEvent, IconDownload, IconStar } from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDownlist } from "../hooks/use-downlist";
import { useReviews } from "../hooks/use-reviews";
import { useSpeweek } from "../hooks/use-speweek";

export function SectionCards() {
  const { reviews } = useReviews();
  const { data: downlist } = useDownlist();
  const { events } = useSpeweek();

  const reviewsThisMonth = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return reviews.filter((review) => {
      const reviewDate = new Date(review.date);
      return (
        reviewDate.getMonth() === currentMonth &&
        reviewDate.getFullYear() === currentYear
      );
    }).length;
  }, [reviews]);

  const activeDownloads = useMemo(() => {
    return downlist.filter((item) => !item.is_downloaded).length;
  }, [downlist]);

  const upcomingEvent = useMemo(() => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const futureEvents = events
      .map((event) => {
        const [month, year] = event.added_month_year.split("-");
        const date = new Date(`${month} 1, ${year}`);
        return { ...event, date };
      })
      .filter(
        (event) =>
          !isNaN(event.date.getTime()) && event.date >= startOfCurrentMonth
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return futureEvents[0];
  }, [events]);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:gap-8 px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <IconStar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reviews.length}</div>
          <p className="text-xs text-muted-foreground">
            +{reviewsThisMonth} this month
          </p>
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
          <div className="text-2xl font-bold">{activeDownloads}</div>
          <p className="text-xs text-muted-foreground">Currently downloading</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Event</CardTitle>
          <IconCalendarEvent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {upcomingEvent ? upcomingEvent.theme : "No events"}
          </div>
          <p className="text-xs text-muted-foreground">
            {upcomingEvent
              ? `${upcomingEvent.added_month_year}`
              : "Check back later"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
