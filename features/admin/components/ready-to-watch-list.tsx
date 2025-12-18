"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlayerPlay } from "@tabler/icons-react";
import { ReviewDialog } from "@/features/admin/components/review-dialog";
import { addReview } from "@/app/actions/reviews-act";
import { type ReviewFormValues } from "@/features/admin/schemas/reviewFormSchema";

interface ReadyToWatchItem {
  id: string;
  title: string;
  year: number;
}

interface ReadyToWatchListProps {
  items: ReadyToWatchItem[];
}

export function ReadyToWatchList({ items }: ReadyToWatchListProps) {
  const [selectedMovie, setSelectedMovie] = useState<ReadyToWatchItem | null>(
    null
  );
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleReviewClick = (movie: ReadyToWatchItem) => {
    setSelectedMovie(movie);
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = async (values: ReviewFormValues) => {
    if (!selectedMovie) return;

    // Panggil server action addReview
    // Karena kita kirim ID, sheet-ops akan otomatis update status is_watched jadi TRUE
    await addReview({
      id: selectedMovie.id,
      title: values.title,
      rating: values.rating,
      date: new Date().toISOString().split("T")[0],
    });

    setIsReviewOpen(false);
    setSelectedMovie(null);
  };

  if (items.length === 0) {
    return (
      <div className="flex h-37.5 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        No movies ready to watch.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{movie.title}</span>
              <span className="text-xs text-muted-foreground">
                {movie.year}
              </span>
            </div>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => handleReviewClick(movie)}
            >
              <IconPlayerPlay className="size-4" />
              Review Now
            </Button>
          </div>
        ))}
      </div>

      <ReviewDialog
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        onSubmit={handleReviewSubmit}
        initialData={
          selectedMovie ? { title: selectedMovie.title, rating: 0 } : undefined
        }
        title="Write Review"
        description={`Reviewing ${selectedMovie?.title}`}
      />
    </>
  );
}
