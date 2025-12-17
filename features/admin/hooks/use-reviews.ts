import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReviewFormValues } from "../schemas/reviewFormSchema";

export type Review = {
  id: string;
  title: string;
  rating: number;
  review?: string;
  watched_date: string;
};

// Mock Data
const initialReviews: Review[] = [
  {
    id: "4", // Matching Oppenheimer from Downlist mock
    title: "Oppenheimer",
    rating: 9,
    review: "Masterpiece.",
    watched_date: "2023-07-21",
  },
  {
    id: "7", // Matching Killers of the Flower Moon
    title: "Killers of the Flower Moon",
    rating: 8,
    review: "Long but worth it.",
    watched_date: "2023-10-20",
  },
  {
    id: "101", // Matching Interstellar from Speweek mock
    title: "Interstellar",
    rating: 10,
    review: "Mind blowing.",
    watched_date: "2014-11-07",
  },
];

let mockReviews = [...initialReviews];

const fetchReviews = async (): Promise<Review[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...mockReviews];
};

export function useReviews() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    initialData: initialReviews,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  };

  const addReviewMutation = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        title: values.title,
        rating: values.rating,
        review: values.review,
        watched_date: new Date().toISOString().split("T")[0],
      };
      mockReviews = [newReview, ...mockReviews];
    },
    ...mutationOptions,
  });

  const editReviewMutation = useMutation({
    mutationFn: async ({
      id,
      ...values
    }: ReviewFormValues & { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      mockReviews = mockReviews.map((r) =>
        r.id === id ? { ...r, ...values } : r
      );
    },
    ...mutationOptions,
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      mockReviews = mockReviews.filter((r) => r.id !== id);
    },
    ...mutationOptions,
  });

  return {
    reviews: query.data,
    isLoading: query.isLoading,
    addReview: addReviewMutation.mutateAsync,
    editReview: editReviewMutation.mutateAsync,
    deleteReview: deleteReviewMutation.mutateAsync,
  };
}
