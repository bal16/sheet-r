"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpDown,
  Download,
  Eye,
  ListPlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DataTable } from "@/features/admin/components/data-table";
import { SiteHeader } from "@/features/admin/components/site-header";

import { useDownlist, DownlistItem } from "@/features/admin/hooks/use-downlist";
import {
  downlistFormSchema,
  type DownlistFormValues,
} from "@/features/admin/schemas/downlistFormSchema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReviewDialog } from "@/features/admin/components/review-dialog";
import { useReviews } from "@/features/admin/hooks/use-reviews";
import { type ReviewFormValues } from "@/features/admin/schemas/reviewFormSchema";
import { useQueue } from "@/features/admin/hooks/use-queue";
import { toast } from "sonner";

export default function DownlistPage() {
  const {
    data: rows = [],
    isLoading,
    addDownlist,
    editDownlist,
    toggleDownloaded: toggleMutation,
    deleteDownlist,
  } = useDownlist();

  const { addToQueue } = useQueue();
  const { addReview } = useReviews();

  const [activeTab, setActiveTab] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewInitialData, setReviewInitialData] =
    useState<ReviewFormValues | null>(null);

  const form = useForm<DownlistFormValues>({
    resolver: zodResolver(downlistFormSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
    },
  });

  const handleAdd = () => {
    setEditingId(null);
    form.reset({ title: "", year: new Date().getFullYear() });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: DownlistItem) => {
    setEditingId(item.id);
    form.reset({ title: item.title, year: item.year });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setReviewToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) {
      return;
    }
    try {
      await deleteDownlist(reviewToDelete);
      toast.success("Item deleted successfully");
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const onSubmit = async (values: DownlistFormValues) => {
    try {
      if (editingId) {
        await editDownlist({ id: editingId, ...values });
        toast.success("Item updated successfully");
      } else {
        await addDownlist(values);
        toast.success("Item added successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error("Failed to save item");
    }
  };

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case "Downloaded":
        return rows.filter((r) => r.is_downloaded);
      case "NotDownloaded":
        return rows.filter((r) => !r.is_downloaded);
      case "Watched":
        return rows.filter((r) => r.is_watched);
      case "NotWatched":
        return rows.filter((r) => !r.is_watched);
      default:
        return rows;
    }
  }, [activeTab, rows]);

  const toggleDownloaded = (id: string, value: boolean) => {
    // send desired value to server
    toggleMutation(
      { id, is_downloaded: value },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: () => toast.error("Failed to update status"),
      }
    );
  };

  const handleReview = (item: DownlistItem) => {
    setReviewInitialData({ title: item.title, rating: 0 });
    setIsReviewDialogOpen(true);
  };

  const onReviewSubmit = async (values: ReviewFormValues) => {
    try {
      await addReview(values);
      toast.success("Review submitted successfully");
      setIsReviewDialogOpen(false);
    } catch {
      toast.error("Failed to submit review");
    }
  };

  const columns: ColumnDef<DownlistItem>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "year",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("year")}</div>,
      enableSorting: true,
    },
    {
      id: "is_downloaded",
      header: "Downloaded",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Checkbox
            checked={row.original.is_downloaded}
            onCheckedChange={(value) =>
              toggleDownloaded(row.original.id, !!value)
            }
            aria-label="Toggle downloaded"
          />
          <span className="ml-2 text-xs text-muted-foreground">
            {row.original.is_downloaded ? "Yes" : "No"}
          </span>
        </div>
      ),
    },
    {
      id: "is_watched",
      header: "Watched",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Checkbox
              checked={row.original.is_watched}
              disabled
              aria-label="Watched (from reviews)"
            />
            <span className="ml-2 text-xs text-muted-foreground">
              {row.original.is_watched ? "Yes" : "No"}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => toggleDownloaded(row.original.id, true)}
              >
                <Download className="mr-2 h-4 w-4" /> Set Downloaded
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toast.promise(
                    addToQueue({
                      id: row.original.id,
                      title: row.original.title,
                      origin: "downlist",
                    }),
                    {
                      loading: "Adding to queue...",
                      success: "Added to queue",
                      error: "Failed to add to queue",
                    }
                  )
                }
              >
                <ListPlus className="mr-2 h-4 w-4" /> Add to Queue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReview(row.original)}>
                <Pencil className="mr-2 h-4 w-4" /> Write Review
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeleteClick(row.original.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <SiteHeader name="Downlist" />
      <Tabs defaultValue="All" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold tracking-tight">
              Downlist Manager
            </h1>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Downlist
            </Button>
          </div>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Downloaded">Downloaded</TabsTrigger>
            <TabsTrigger value="NotDownloaded">Not Downloaded</TabsTrigger>
            <TabsTrigger value="Watched">Watched</TabsTrigger>
            <TabsTrigger value="NotWatched">Not Watched</TabsTrigger>
          </TabsList>

          <DataTable
            columns={columns}
            data={filteredData}
            filterKey="title"
            isLoading={isLoading}
          />
        </div>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Movie" : "Add Movie"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Edit the details of the movie."
                : "Add a new movie to your downlist."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Input id="title" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </div>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="year"
                  render={({ field, fieldState }) => (
                    <Field
                      className="grid grid-cols-4 items-center gap-4"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel className="text-right">Year</FieldLabel>
                      <div className="col-span-3">
                        <Input id="year" type="number" {...field} />
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
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        onSubmit={onReviewSubmit}
        initialData={reviewInitialData}
        title="Write Review"
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              review from your archive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
