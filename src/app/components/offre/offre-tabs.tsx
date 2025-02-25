"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OffreTable } from "./offre-table"

export function OffreTabs({ refreshTrigger }: { refreshTrigger: boolean }) {
  return (
    <Tabs defaultValue="offre" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="offre"
          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
        >
          offre
        </TabsTrigger>
      </TabsList>
      <TabsContent value="offre" className="p-6">
        <OffreTable refresh={refreshTrigger} />
      </TabsContent>
    </Tabs>
  )
}