import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type EventFormValues,
  type MovieFormValues,
} from "../schemas/speweekFormSchema";
import {
  getSpeweek,
  addSpeweekEvent,
  addToSpeweek,
  deleteSpeweekItem,
} from "@/app/actions/speweek-act";
import { toast } from "sonner";

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

export function useSpeweek() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["speweek"],
    queryFn: async () => await getSpeweek(),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["speweek"] });

  const addEvent = useMutation({
    mutationFn: async (values: EventFormValues) =>
      addSpeweekEvent({
        theme: values.theme,
        added_month_year: values.added_month_year,
      }),
    onSuccess: () => {
      invalidate();
      toast.success("Event added successfully");
    },
    onError: () => {
      toast.error("Failed to add event");
    },
  });

  const addMovie = useMutation({
    mutationFn: async ({
      eventId,
      values,
    }: {
      eventId: string;
      values: MovieFormValues;
    }) => {
      const events = queryClient.getQueryData<Event[]>(["speweek"]) ?? [];
      const target = events.find((e) => e.id === eventId);
      if (!target) throw new Error("Event not found");

      // const title_year = `${values.title} (${values.year})`;
      await addToSpeweek({
        title: values.title,
        release_year: String(values.year),
        theme: target.theme,
        added_month_year: target.added_month_year,
      });
    },
    onSuccess: () => {
      invalidate();
      toast.success("Movie added successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add movie"
      );
    },
  });

  const removeMovie = useMutation({
    mutationFn: async ({ movieId }: { eventId: string; movieId: string }) =>
      deleteSpeweekItem(movieId),
    onSuccess: () => {
      invalidate();
      toast.success("Movie removed successfully");
    },
    onError: () => toast.error("Failed to remove movie"),
  });

  return {
    events: query.data ?? [],
    isLoading: query.isLoading,
    addEvent: addEvent.mutateAsync,
    addMovie: addMovie.mutateAsync,
    removeMovie: removeMovie.mutateAsync,
  };
}
