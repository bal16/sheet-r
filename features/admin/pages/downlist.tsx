"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowUpDown,
  Download,
  Eye,
  MoreHorizontal,
  Pencil,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/features/admin/components/app-sidebar";
import { DataTable } from "@/features/admin/components/data-table";
import { SiteHeader } from "@/features/admin/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DownlistItem = {
  id: string;
  title: string;
  year: number;
  is_downloaded: boolean;
  // is_watched is derived from Review table (do not toggle directly here)
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
    is_watched: false,
  },
  {
    id: "5",
    title: "Past Lives",
    year: 2023,
    is_downloaded: false,
    is_watched: false,
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

// Simulate Review table membership (IDs present here are "watched")
const reviewedIds = new Set<string>(["4", "7"]);

export default function Downlist() {
  const [rows, setRows] = useState<DownlistItem[]>(initialData);
  const [activeTab, setActiveTab] = useState("All");

  // Compute is_watched from Review table
  const computedRows = useMemo(
    () => rows.map((r) => ({ ...r, is_watched: reviewedIds.has(r.id) })),
    [rows]
  );

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case "Downloaded":
        return computedRows.filter((r) => r.is_downloaded);
      case "NotDownloaded":
        return computedRows.filter((r) => !r.is_downloaded);
      case "Watched":
        return computedRows.filter((r) => r.is_watched);
      case "NotWatched":
        return computedRows.filter((r) => !r.is_watched);
      default:
        return computedRows;
    }
  }, [activeTab, computedRows]);

  const toggleDownloaded = (id: string, value: boolean) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_downloaded: value } : r))
    );
  };

  const columns: ColumnDef<DownlistItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
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
      header: "Year",
      cell: ({ row }) => <div>{row.getValue("year") as number}</div>,
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
        const watched = reviewedIds.has(row.original.id);
        return (
          <div className="flex items-center">
            <Checkbox
              checked={watched}
              disabled
              aria-label="Watched (from reviews)"
            />
            <span className="ml-2 text-xs text-muted-foreground">
              {watched ? "Yes" : "No"}
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
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Write Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold tracking-tight">
              Downlist Manager
            </h1>
          </div>

          <Tabs
            defaultValue="All"
            className="w-full"
            onValueChange={setActiveTab}
          >
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
            />
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
