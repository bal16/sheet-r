import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type EventFormValues,
  type MovieFormValues,
} from "../schemas/speweekFormSchema";

export type Movie = {
  id: string;
  title_year: string;
  is_watched: boolean;
};

export type Event = {
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

let mockEvents = [...initialEvents];

const fetchEvents = async (): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...mockEvents];
};

export function useSpeweek() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["speweek"],
    queryFn: fetchEvents,
    initialData: initialEvents,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speweek"] });
    },
  };

  const addEventMutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        theme: values.theme,
        added_month_year: values.added_month_year,
        movies: [],
      };
      mockEvents = [...mockEvents, newEvent];
    },
    ...mutationOptions,
  });

  const addMovieMutation = useMutation({
    mutationFn: async ({
      eventId,
      values,
    }: {
      eventId: string;
      values: MovieFormValues;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const titleYear = `${values.title} (${values.year})`;
      mockEvents = mockEvents.map((ev) => {
        if (ev.id === eventId) {
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
      });
    },
    ...mutationOptions,
  });

  const removeMovieMutation = useMutation({
    mutationFn: async ({
      eventId,
      movieId,
    }: {
      eventId: string;
      movieId: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      mockEvents = mockEvents.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            movies: ev.movies.filter((m) => m.id !== movieId),
          };
        }
        return ev;
      });
    },
    ...mutationOptions,
  });

  return {
    events: query.data,
    isLoading: query.isLoading,
    addEvent: addEventMutation.mutateAsync,
    addMovie: addMovieMutation.mutateAsync,
    removeMovie: removeMovieMutation.mutateAsync,
  };
}
