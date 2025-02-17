import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Trash } from "lucide-react"

const reviewTypes = [
  {
    id: 1,
    name: "Monthly Review",
    createdBy: {
      name: "Richard Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    scheduledFor: "Everyone",
  },
  // Add more review types as needed
]

export function ReviewTypesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Scheduled For</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviewTypes.map((type) => (
          <TableRow key={type.id}>
            <TableCell className="font-medium">{type.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={type.createdBy.avatar} />
                  <AvatarFallback>{type.createdBy.name[0]}</AvatarFallback>
                </Avatar>
                <span>{type.createdBy.name}</span>
              </div>
            </TableCell>
            <TableCell>{type.scheduledFor}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

