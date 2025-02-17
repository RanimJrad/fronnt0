"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewsTable } from "./employee-table"
import { ReviewTypesTable } from "./employee-types-table"

export function ReviewsTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="overview"
          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="types"
          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
        >
          Review Types
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-6">
        <ReviewsTable />
      </TabsContent>
      <TabsContent value="types" className="p-6">
        <ReviewTypesTable />
      </TabsContent>
    </Tabs>
  )
}

