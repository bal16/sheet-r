import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReviewFormValues } from "../schemas/reviewFormSchema";
import {
  getReviews as getReviewsAction,
  addReview as addReviewAction,
  updateReview as updateReviewAction,
  deleteReview as deleteReviewAction,
} from "@/app/actions/reviews-act";

export type Review = {
  id: string;
  title: string;
  rating: number;
  date: string;
};

export function useReviews() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["reviews"],
    queryFn: async (): Promise<Review[]> => await getReviewsAction(),
  });

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["reviews"] }),
      queryClient.invalidateQueries({ queryKey: ["downlist"] }),
      queryClient.invalidateQueries({ queryKey: ["speweek"] }),
    ]);

  const addReview = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      await addReviewAction({
        title: values.title,
        rating: values.rating,
        date: new Date().toISOString().split("T")[0],
      });
    },
    onSuccess: invalidate,
  });

  const editReview = useMutation({
    mutationFn: async ({ id, ...values }: ReviewFormValues & { id: string }) =>
      updateReviewAction({ id, title: values.title, rating: values.rating }),
    onSuccess: invalidate,
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => deleteReviewAction(id),
    onSuccess: invalidate,
  });

  return {
    reviews: query.data ?? [],
    isLoading: query.isLoading,
    addReview: addReview.mutateAsync,
    editReview: editReview.mutateAsync,
    deleteReview: deleteReview.mutateAsync,
  };
}
