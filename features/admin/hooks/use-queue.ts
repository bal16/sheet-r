import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  updateQueueOrder,
  removeFromQueue,
  addToQueue,
  type QueueItem,
} from "@/app/actions/queue-act";

export function useQueue() {
  const QueryClient = useQueryClient();
  const reorderMutation = useMutation({
    mutationFn: async (items: QueueItem[]) => {
      await updateQueueOrder(items);
    },
    onSuccess: () => {
      // Opsional: invalidate query jika kita fetch queue di client juga
      QueryClient.invalidateQueries({ queryKey: ["queue"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (refId: string) => {
      await removeFromQueue(refId);
    },
    onSuccess: () => {
      // Refresh halaman atau data dashboard
      // router.refresh() bisa dilakukan di component
    },
  });

  const addMutation = useMutation({
    mutationFn: async (movie: {
      id: string;
      title: string;
      origin: "downlist" | "speweek";
    }) => {
      await addToQueue(movie);
    },
  });

  return {
    reorderQueue: reorderMutation.mutateAsync,
    removeFromQueue: removeMutation.mutateAsync,
    addToQueue: addMutation.mutateAsync,
    isReordering: reorderMutation.isPending,
  };
}
