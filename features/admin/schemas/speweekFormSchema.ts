import * as z  from "zod";

export const eventFormSchema = z.object({
  theme: z.string().min(1, "Theme is required"),
  added_month_year: z
    .string()
    .min(1, "Month-Year is required")
    .regex(/^\d{1,2}-\d{4}$/, "Format must be MM-YYYY (e.g. 10-2025)"),
});

export const movieFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.coerce
    .number<number>( "Year must be a number")
    .min(1888, "Year must be valid")
    .max(new Date().getFullYear() + 5),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
export type MovieFormValues = z.infer<typeof movieFormSchema>;
