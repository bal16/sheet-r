"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  reviewFormSchema,
  type ReviewFormValues,
} from "@/features/admin/schemas/reviewFormSchema";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  initialData?: ReviewFormValues | null;
  title?: string;
  description?: string;
}

export function ReviewDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title = "Review",
  description = "Add or edit a review.",
}: ReviewDialogProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: "",
      rating: 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        initialData ?? {
          title: "",
          rating: 0,
        }
      );
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: ReviewFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field
                    className="grid grid-cols-4 items-center gap-4"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="text-right">Title</FieldLabel>
                    <div className="col-span-3">
                      <Input id="title" placeholder="Movie Title" {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="rating"
                render={({ field, fieldState }) => (
                  <Field
                    className="grid grid-cols-4 items-center gap-4"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="text-right">Rating</FieldLabel>
                    <div className="col-span-3">
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0-10"
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
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
