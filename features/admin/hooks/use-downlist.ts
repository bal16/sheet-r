import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DownlistFormValues } from "../schemas/downlistFormSchema";
import {
  getDownlist,
  addToDownlist,
  updateDownlistItem,
  setDownloadStatus,
} from "@/app/actions/sheet-ops";

export type DownlistItem = {
  id: string;
  title: string;
  year: number;
  is_downloaded: boolean;
  is_watched: boolean;
};

export function useDownlist() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["downlist"],
    queryFn: async () => await getDownlist(),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["downlist"] });

  const addMutation = useMutation({
    mutationFn: async (values: DownlistFormValues) => {
      await addToDownlist(values.title, String(values.year));
    },
    onSuccess: invalidate,
  });

  const editMutation = useMutation({
    mutationFn: async ({
      id,
      ...values
    }: DownlistFormValues & { id: string }) =>
      updateDownlistItem({ id, title: values.title, year: values.year }),
    onSuccess: invalidate,
  });

  // Set downloaded status based on desired value
  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      is_downloaded,
    }: {
      id: string;
      is_downloaded: boolean;
    }) => {
      await setDownloadStatus(id, is_downloaded);
    },
    onSuccess: invalidate,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    addDownlist: addMutation.mutateAsync,
    editDownlist: editMutation.mutateAsync,
    toggleDownloaded: toggleMutation.mutate,
    isAdding: addMutation.isPending,
    isEditing: editMutation.isPending,
  };
}
