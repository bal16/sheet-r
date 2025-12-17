import * as z from "zod";

export const downlistFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.coerce
    .number<number>()
    .min(1888, "Year must be valid")
    .max(new Date().getFullYear() + 5),
});

export type DownlistFormValues = z.infer<typeof downlistFormSchema>;