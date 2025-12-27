"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { useQueue } from "../hooks/use-queue";
import { Button } from "@/components/ui/button";
import { IconPlayerPlay, IconTrash } from "@tabler/icons-react";
import { ReviewDialog } from "@/features/admin/components/review-dialog";
import { addReview } from "@/app/actions/reviews-act";
import { type ReviewFormValues } from "@/features/admin/schemas/reviewFormSchema";
import { toast } from "sonner";

export type QueueItem = {
  id: string;
  title: string;
  type: "downlist" | "speweek";
};

interface QueueListProps {
  initialItems: QueueItem[];
}

export function QueueList({ initialItems }: QueueListProps) {
  const [items, setItems] = useState<QueueItem[]>(initialItems);
  const { reorderQueue, removeFromQueue, isReordering } = useQueue();
  const [reviewItem, setReviewItem] = useState<QueueItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Sync with server updates
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);

    try {
      await reorderQueue(newItems);
      toast.success("Queue reordered successfully");
    } catch {
      setItems(items);
      toast.error("Failed to reorder queue");
    }
  };

  const handleReviewClick = (item: QueueItem) => {
    setReviewItem(item);
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = async (values: ReviewFormValues) => {
    if (!reviewItem) return;

    try {
      await addReview({
        id: reviewItem.id,
        title: values.title,
        rating: values.rating,
        date: new Date().toISOString().split("T")[0],
      });

      await removeFromQueue(reviewItem.id);
      setItems((prev) => prev.filter((i) => i.id !== reviewItem.id));

      setIsReviewOpen(false);
      setReviewItem(null);
      toast.success("Review submitted successfully");
    } catch {
      toast.error("Failed to submit review");
    }
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await removeFromQueue(id);
      toast.success("Item removed from queue");
    } catch {
      setItems(items);
      toast.error("Failed to remove item");
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="queue" isDropDisabled={isReordering}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={isReordering}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 bg-slate-900 border border-slate-800 rounded flex items-center gap-4"
                    >
                      {/* Nomor Urut */}
                      <div className="font-bold text-2xl text-slate-700 w-8">
                        #{index + 1}
                      </div>

                      {/* Info Film */}
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <span className="text-xs uppercase text-slate-500">
                          {item.type}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleReviewClick(item)}
                        >
                          <IconPlayerPlay className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ReviewDialog
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        onSubmit={handleReviewSubmit}
        initialData={reviewItem ? { title: reviewItem.title, rating: 0 } : null}
        title="Review & Complete"
        description={`Reviewing ${reviewItem?.title} will remove it from the queue.`}
      />
    </>
  );
}
