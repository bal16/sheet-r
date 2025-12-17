"use client";

import { useState, type CSSProperties } from "react";
import { Calendar, Check, Plus, Trash2 } from "lucide-react";

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
import { Label } from "@/components/ui/label";

type Movie = {
  id: string;
  title_year: string;
  is_watched: boolean;
};

type Event = {
  id: string;
  theme: string;
  added_month_year: string;
  movies: Movie[];
};

// Mock Data
const initialEvents: Event[] = [
  {
    id: "1",
    theme: "Nolan Marathon",
    added_month_year: "10-2025",
    movies: [
      { id: "4", title_year: "Oppenheimer (2023)", is_watched: false },
      { id: "101", title_year: "Interstellar (2014)", is_watched: true },
      { id: "102", title_year: "Inception (2010)", is_watched: true },
    ],
  },
  {
    id: "2",
    theme: "Ghibli Week",
    added_month_year: "11-2025",
    movies: [
      {
        id: "3",
        title_year: "The Boy and the Heron (2023)",
        is_watched: false,
      },
      { id: "103", title_year: "Spirited Away (2001)", is_watched: true },
    ],
  },
  {
    id: "3",
    theme: "Horror Night",
    added_month_year: "10-2025",
    movies: [],
  },
];

export default function SpeweekPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newTheme, setNewTheme] = useState("");
  const [newMonthYear, setNewMonthYear] = useState("");

  // State for "Add Movie" dialog
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieYear, setNewMovieYear] = useState("");

  const handleAddEvent = () => {
    if (!newTheme) return;
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      theme: newTheme,
      added_month_year: newMonthYear || "TBD",
      movies: [],
    };
    setEvents([...events, newEvent]);
    setNewTheme("");
    setNewMonthYear("");
    setIsAddEventOpen(false);
  };

  const handleAddMovieToEvent = () => {
    if (!selectedEventId || !newMovieTitle || !newMovieYear) return;

    const titleYear = `${newMovieTitle} (${newMovieYear})`;

    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === selectedEventId) {
          return {
            ...ev,
            movies: [
              ...ev.movies,
              {
                id: Math.random().toString(36).substr(2, 9),
                title_year: titleYear,
                is_watched: false,
              },
            ],
          };
        }
        return ev;
      })
    );
    setIsAddMovieOpen(false);
    setNewMovieTitle("");
    setNewMovieYear("");
  };

  const openAddMovieDialog = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsAddMovieOpen(true);
  };

  const removeMovieFromEvent = (eventId: string, movieId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            movies: ev.movies.filter((m) => m.id !== movieId),
          };
        }
        return ev;
      })
    );
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Theme
                    </Label>
                    <Input
                      id="name"
                      value={newTheme}
                      onChange={(e) => setNewTheme(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. Horror Marathon"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Month-Year
                    </Label>
                    <Input
                      id="date"
                      value={newMonthYear}
                      onChange={(e) => setNewMonthYear(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. 10-2025"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEvent}>Create Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
            {events.map((event) => (
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              removeMovieFromEvent(event.id, movie.id)
                            }
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="movie-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="movie-title"
                    value={newMovieTitle}
                    onChange={(e) => setNewMovieTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Inception"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="movie-year" className="text-right">
                    Year
                  </Label>
                  <Input
                    id="movie-year"
                    value={newMovieYear}
                    onChange={(e) => setNewMovieYear(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. 2010"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddMovieToEvent}>Add Movie</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
