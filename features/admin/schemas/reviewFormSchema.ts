import  * as z  from "zod";

export const reviewFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  rating: z.coerce
    .number<number>()
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must be at most 10"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
