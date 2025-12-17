"use client";

import { useState, type CSSProperties } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Check, Plus, Star, Trash2 } from "lucide-react";

import { AppSidebar } from "@/features/admin/components/app-sidebar";
import { SiteHeader } from "@/features/admin/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpeweek } from "@/features/admin/hooks/use-speweek";
import {
  eventFormSchema,
  movieFormSchema,
  type EventFormValues,
  type MovieFormValues,
} from "@/features/admin/schemas/speweekFormSchema";
import { ReviewDialog } from "@/features/admin/components/review-dialog";
import { useReviews } from "@/features/admin/hooks/use-reviews";
import { type ReviewFormValues } from "@/features/admin/schemas/reviewFormSchema";

export default function SpeweekPage() {
  const {
    events = [],
    isLoading,
    addEvent,
    addMovie,
    removeMovie,
  } = useSpeweek();
  const { addReview } = useReviews();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewInitialData, setReviewInitialData] =
    useState<ReviewFormValues | null>(null);

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      theme: "",
      added_month_year: "",
    },
  });

  const movieForm = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
    },
  });

  const onAddEventSubmit = async (values: EventFormValues) => {
    await addEvent(values);
    setIsAddEventOpen(false);
    eventForm.reset();
  };

  const onAddMovieSubmit = async (values: MovieFormValues) => {
    if (selectedEventId) {
      await addMovie({ eventId: selectedEventId, values });
      setIsAddMovieOpen(false);
      movieForm.reset();
    }
  };

  const openAddMovieDialog = (eventId: string) => {
    setSelectedEventId(eventId);
    movieForm.reset({ title: "", year: new Date().getFullYear() });
    setIsAddMovieOpen(true);
  };

  const handleReview = (movieTitle: string) => {
    setReviewInitialData({ title: movieTitle, rating: 0 });
    setIsReviewDialogOpen(true);
  };

  const onReviewSubmit = async (values: ReviewFormValues) => {
    values.title = values.title.split(" (")[0];
    await addReview(values);
  };

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
      <SidebarInset>
        <SiteHeader name="Speweek" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold tracking-tight">
              Speweek Curator
            </h1>
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Add a new movie marathon or weekly theme.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={eventForm.handleSubmit(onAddEventSubmit)}>
                  <div className="grid gap-4 py-4">
                    <FieldGroup>
                      <Controller
                        control={eventForm.control}
                        name="theme"
                        render={({ field, fieldState }) => (
                          <Field
                            className="grid grid-cols-4 items-center gap-4"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldLabel className="text-right">
                              Theme
                            </FieldLabel>
                            <div className="col-span-3">
                              <Input
                                id="name"
                                placeholder="e.g. Horror Marathon"
                                {...field}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </div>
                          </Field>
                        )}
                      />
                      <Controller
                        control={eventForm.control}
                        name="added_month_year"
                        render={({ field, fieldState }) => (
                          <Field
                            className="grid grid-cols-4 items-center gap-4"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldLabel className="text-right">
                              Month-Year
                            </FieldLabel>
                            <div className="col-span-3">
                              <Input
                                id="date"
                                placeholder="e.g. 10-2025"
                                {...field}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </div>
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Event</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="flex flex-col h-full">
                    <CardHeader>
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
              : events.map((event) => (
                  <Card key={event.id} className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{event.theme}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Calendar className="mr-1 h-3 w-3" />
                            {event.added_month_year}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {event.movies.length === 0 ? (
                        <div className="text-sm text-muted-foreground italic py-4 text-center border border-dashed rounded-md">
                          No movies added yet.
                        </div>
                      ) : (
                        <ul className="space-y-2">
                          {event.movies.map((movie) => (
                            <li
                              key={movie.id}
                              className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50 group"
                            >
                              <div className="flex items-center gap-2">
                                {movie.is_watched ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                                )}
                                <span
                                  className={
                                    movie.is_watched
                                      ? "text-muted-foreground line-through"
                                      : ""
                                  }
                                >
                                  {movie.title_year}
                                </span>
                              </div>
                              <div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleReview(movie.title_year)}
                                >
                                  <Star className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() =>
                                    removeMovie({
                                      eventId: event.id,
                                      movieId: movie.id,
                                    })
                                  }
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => openAddMovieDialog(event.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Movie
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>

          {/* Add Movie Dialog (Shared) */}
          <Dialog open={isAddMovieOpen} onOpenChange={setIsAddMovieOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Movie to Event</DialogTitle>
                <DialogDescription>
                  Enter the movie details manually.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={movieForm.handleSubmit(onAddMovieSubmit)}>
                <div className="grid gap-4 py-4">
                  <FieldGroup>
                    <Controller
                      control={movieForm.control}
                      name="title"
                      render={({ field, fieldState }) => (
                        <Field
                          className="grid grid-cols-4 items-center gap-4"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel className="text-right">Title</FieldLabel>
                          <div className="col-span-3">
                            <Input
                              id="movie-title"
                              placeholder="e.g. Inception"
                              {...field}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </div>
                        </Field>
                      )}
                    />
                    <Controller
                      control={movieForm.control}
                      name="year"
                      render={({ field, fieldState }) => (
                        <Field
                          className="grid grid-cols-4 items-center gap-4"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel className="text-right">Year</FieldLabel>
                          <div className="col-span-3">
                            <Input
                              id="movie-year"
                              placeholder="e.g. 2010"
                              {...field}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </div>
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Movie</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <ReviewDialog
            open={isReviewDialogOpen}
            onOpenChange={setIsReviewDialogOpen}
            onSubmit={onReviewSubmit}
            initialData={reviewInitialData}
            title="Write Review"
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
