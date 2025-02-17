"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Trash, Check } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Monthly Review",
    reviewer: {
      name: "Richard Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    beginDate: "15 Dec 2023",
    dueDate: "17 Dec 2023",
    status: "In Progress",
  },
  // Add more review data as needed
]

export function ReviewsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Review Name</TableHead>
          <TableHead>Reviewer</TableHead>
          <TableHead>Begin On</TableHead>
          <TableHead>Due By</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell className="font-medium">{review.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.reviewer.avatar} />
                  <AvatarFallback>{review.reviewer.name[0]}</AvatarFallback>
                </Avatar>
                <span>{review.reviewer.name}</span>
              </div>
            </TableCell>
            <TableCell>{review.beginDate}</TableCell>
            <TableCell>{review.dueDate}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {review.status}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4" />
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4" />
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
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

