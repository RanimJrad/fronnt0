"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArchiveTable } from "./archive_table"

export function ReviewsTabs({ refreshTrigger }: { refreshTrigger: boolean }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="overview"
          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
        >
          Overview
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-6">
        <ArchiveTable refresh={refreshTrigger} />
      </TabsContent>
    </Tabs>
  )
}

