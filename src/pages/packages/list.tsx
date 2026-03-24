import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { Package } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const PackagesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const packageColumns = useMemo<ColumnDef<Package>[]>((
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title ml-2">Package Name</p>,
        cell: ({ getValue }) => (
          <span className="text-base text-foreground ml-2 font-medium">{getValue<string>()}</span>
        ),
      },
      {
        id: "category",
        accessorKey: "category",
        size: 100,
        header: () => <p className="column-title">Category</p>,
        cell: ({ getValue }) => {
          const category = getValue<string>();
          const variant = category === "offer" ? "secondary" : "default";
          return <Badge variant={variant} className="capitalize">{category}</Badge>;
        },
      },
      {
        id: "durationInDays",
        accessorKey: "durationInDays",
        size: 150,
        header: () => <p className="column-title">Duration (Days)</p>,
        cell: ({ getValue }) => (
          <span className="text-base text-foreground">{getValue<number>()} Days</span>
        ),
      },
      {
        id: "price",
        accessorKey: "price",
        size: 150,
        header: () => <p className="column-title">Price</p>,
        cell: ({ getValue }) => (
          <span className="text-base text-foreground font-semibold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "KES",
            }).format(Number(getValue<string>()))}
          </span>
        ),
      },
      {
        id: "isActive",
        accessorKey: "isActive",
        size: 100,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const isActive = getValue<boolean>();
          const variant = isActive ? "default" : "destructive";
          return <Badge variant={variant}>{isActive ? "Active" : "Inactive"}</Badge>;
        },
      }
    ]
  ), []);

  const categoryFilters = 
  selectedCategory === "all" 
  ? [] 
  : [
    { field: "category", 
      operator: "eq" as const, 
      value: selectedCategory 
    }];

  const searchFilters = searchQuery
  ? [
    {
      field: "name",
      operator: "contains" as const,
      value: searchQuery,
    }
  ]
  : [];

  const packagesTable = useTable<Package>({
    columns: packageColumns,
    refineCoreProps: {
      resource: "packages",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...categoryFilters, ...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "name",
            order: "asc",
          }
        ]
      },
    }
  });

  return (
    <ListView>
      <Breadcrumb />

      <div className="intro-row">
        <p className="text-lg font-medium"> All Packages</p>

        <div className="actions-row">
          <div className="search-field">
             <Search className="search-icon" />
             <Input 
             type="text"
             placeholder="Search packages..."
             className="pl-10 w-full"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
              </SelectContent>
            </Select>

            <CreateButton resource="packages" />
          </div>
        </div>
      </div>

      <DataTable table={packagesTable} />
    </ListView>
  )
}

export default PackagesList