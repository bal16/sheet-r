import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DownlistFormValues } from "../schemas/downlistFormSchema";

export type DownlistItem = {
  id: string;
  title: string;
  year: number;
  is_downloaded: boolean;
  is_watched: boolean;
};

// Demo data
const initialData: DownlistItem[] = [
  {
    id: "1",
    title: "Dune: Part Two",
    year: 2024,
    is_downloaded: true,
    is_watched: false,
  },
  {
    id: "2",
    title: "Poor Things",
    year: 2023,
    is_downloaded: false,
    is_watched: false,
  },
  {
    id: "3",
    title: "The Boy and the Heron",
    year: 2023,
    is_downloaded: false,
    is_watched: false,
  },
  {
    id: "4",
    title: "Oppenheimer",
    year: 2023,
    is_downloaded: true,
    is_watched: true,
  },
  {
    id: "5",
    title: "Past Lives",
    year: 2023,
    is_downloaded: false,
    is_watched: true,
  },
  {
    id: "6",
    title: "Anatomy of a Fall",
    year: 2023,
    is_downloaded: true,
    is_watched: false,
  },
  {
    id: "7",
    title: "Killers of the Flower Moon",
    year: 2023,
    is_downloaded: true,
    is_watched: false,
  },
  {
    id: "8",
    title: "Barbie",
    year: 2023,
    is_downloaded: false,
    is_watched: false,
  },
  {
    id: "9",
    title: "Godzilla Minus One",
    year: 2023,
    is_downloaded: false,
    is_watched: false,
  },
];

// Mock Database and API
let mockData = [...initialData];

const fetchDownlist = async (): Promise<DownlistItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...mockData];
};

export function useDownlist() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["downlist"],
    queryFn: fetchDownlist,
    initialData,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downlist"] });
    },
  };

  const addMutation = useMutation({
    mutationFn: async (values: DownlistFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...values,
        is_downloaded: false,
        is_watched: false,
      };
      mockData = [newItem, ...mockData];
    },
    ...mutationOptions,
  });

  const editMutation = useMutation({
    mutationFn: async ({
      id,
      ...values
    }: DownlistFormValues & { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      mockData = mockData.map((item) =>
        item.id === id ? { ...item, ...values } : item
      );
    },
    ...mutationOptions,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      is_downloaded,
    }: {
      id: string;
      is_downloaded: boolean;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      mockData = mockData.map((item) =>
        item.id === id ? { ...item, is_downloaded } : item
      );
    },
    ...mutationOptions,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    addDownlist: addMutation.mutateAsync,
    editDownlist: editMutation.mutateAsync,
    toggleDownloaded: toggleMutation.mutate,
    isAdding: addMutation.isPending,
    isEditing: editMutation.isPending,
  };
}
