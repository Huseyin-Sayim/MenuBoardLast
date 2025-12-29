import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UsersTableSkeleton() {
  return (
    <div className="p-4 sm:p-7.5">
      <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>

      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4">
            <TableHead className="xl:pl-7.5">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
            </TableHead>
            <TableHead>
              <div className="h-4 w-20 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
            </TableHead>
            <TableHead>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
            </TableHead>
            <TableHead>
              <div className="h-4 w-16 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
            </TableHead>
            <TableHead>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i} className="border-[#eee] dark:border-dark-3">
              <TableCell className="xl:pl-7.5">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-40 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-28 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
              </TableCell>
              <TableCell>
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-2 dark:bg-dark-2"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-2 dark:bg-dark-2"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

