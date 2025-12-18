"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { DataTable } from "@/features/admin/components/data-table";
import { SiteHeader } from "@/features/admin/components/site-header";
import { ReviewDialog } from "@/features/admin/components/review-dialog";

import { useReviews, type Review } from "@/features/admin/hooks/use-reviews";
import { type ReviewFormValues } from "@/features/admin/schemas/reviewFormSchema";

export default function ReviewsPage() {
  const {
    reviews = [],
    isLoading,
    addReview,
    editReview,
    deleteReview,
  } = useReviews();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const handleAdd = () => {
    setSelectedReview(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
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
    await deleteReview(reviewToDelete);
    setIsDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  const onSubmit = async (values: ReviewFormValues) => {
    if (selectedReview) {
      await editReview({ id: selectedReview.id, ...values });
    } else {
      await addReview(values);
    }
  };

  const columns: ColumnDef<Review>[] = [
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
      accessorKey: "rating",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="pl-4">{row.getValue("rating")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
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
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(row.original)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClick(row.original.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      <SiteHeader name="Reviews" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold tracking-tight">Review Archive</h1>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Manual Review
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={reviews}
          filterKey="title"
          isLoading={isLoading}
        />

        <ReviewDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={onSubmit}
          initialData={selectedReview}
          title={selectedReview ? "Edit Review" : "Add Manual Review"}
          description={
            selectedReview
              ? "Update your review details."
              : "Add a review for a movie not in your lists."
          }
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
      </div>
    </>
  );
}
