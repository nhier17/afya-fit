import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { Member } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const MembersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("all");

  const memberColumns = useMemo<ColumnDef<Member>[]>((
    () => [
      {
        id: "id",
        accessorKey: "id",
        size: 100,
        header: () => <p className="column-title ml-2">Number</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "phone",
        accessorKey: "phone",
        size: 200,
        header: () => <p className="column-title">Phone</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "gender",
        accessorKey: "gender",
        size: 100,
        header: () => <p className="column-title">Gender</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        size: 150,
        header: () => <p className="column-title">Created Date</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{formatDate(getValue<string>())}</span>
        ),
      },
      {
        id: "startedAt",
        accessorKey: "startedAt",
        size: 150,
        header: () => <p className="column-title">Start Date</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{formatDate(getValue<string>())}</span>
        ),
      },
      {
        id: "endedAt",
        accessorKey: "endedAt",
        size: 150,
        header: () => <p className="column-title">End Date</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{formatDate(getValue<string>())}</span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        size: 100,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
  const status = getValue<string>();

  const variant =
    status === "active"
      ? "default"
      : status === "expired"
      ? "destructive"
      : "secondary";

  return <Badge variant={variant}>{status}</Badge>;
},
      }
    ]
  ), []);

  const genderFilters = 
  selectedGender === "all" 
  ? [] 
  : [
    { field: "gender", 
      operator: "eq" as const, 
      value: selectedGender 
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

  const membersTable = useTable<Member>({
    columns: memberColumns,
    refineCoreProps: {
      resource: "members",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...genderFilters, ...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          }
        ]
      },
    }
  });

  return (
    <ListView>
      <Breadcrumb />

      <div className="intro-row">
        <p className="text-lg font-medium"> All Members</p>

        <div className="actions-row">
          <div className="search-field">
             <Search className="search-icon" />
             <Input 
             type="text"
             placeholder="Search members..."
             className="pl-10 w-full"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <CreateButton resource="members" />
          </div>
        </div>
      </div>

      <DataTable table={membersTable} />
    </ListView>
  )
}

export default MembersList