"use client"

import { useState, useEffect } from "react"
import { Bell, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/app/hooks/use-media-query_notif"
import { useNotifications } from "@/app/hooks/use-notifications"

export default function NotificationsContentRec() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")

  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (isMobile) {
      // Adjust viewport meta tag for mobile
      const viewportMeta = document.querySelector('meta[name="viewport"]')
      if (viewportMeta) {
        viewportMeta.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        )
      }

      // Add touch-friendly scrolling
      document.body.style.overscrollBehavior = "contain"

      return () => {
        // Reset when component unmounts
        if (viewportMeta) {
          viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0")
        }
        document.body.style.overscrollBehavior = "auto"
      }
    }
  }, [isMobile])

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    handleNotificationNavigation(notification)
  }

  const handleNotificationNavigation = (notification: any) => {
    if (notification.type === "offer_validated") {
      window.location.href = `/offre`
    } else if (notification.type === "new_application") {
      window.location.href = `/candidat`
    } else if (notification.type === "account_activated") {
      window.location.href = `/dashbord_rec`
    } else if (notification.type === "offer_rejected") {
      window.location.href = `/offre`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Function to get notification title based on type
  const getNotificationTitle = (type: string) => {
    // Recruiter notification types
    if (type === "offer_validated") return "Offre validée"
    if (type === "new_application") return "Nouvelle candidature"
    if (type === "account_activated") return "Compte activé"
    if (type === "offer_rejected") return "Offre refusée"

    return "Notification"
  }

  // Function to render notification details based on type
  const renderNotificationDetails = (notification: any) => {
    // Recruiter notification types
    if (notification.type === "offer_validated") {
      return (
        <div className="text-sm text-muted-foreground mt-2 p-2 sm:p-3 bg-green-50 dark:bg-green-950/30 rounded-md border-l-2 border-green-500">
          <div>
            Poste: <span className="font-medium">{notification.data.position}</span>
          </div>
          <div>
            Département: <span className="font-medium">{notification.data.department}</span>
          </div>
          <div className="mt-2 text-green-600 dark:text-green-400 font-medium">
            Votre offre est maintenant visible par les candidats
          </div>
        </div>
      )
    }

    if (notification.type === "new_application") {
      return (
        <div className="text-sm text-muted-foreground mt-2 p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border-l-2 border-blue-500">
          <div>
            Candidat: <span className="font-medium">{notification.data.candidate_name}</span>
          </div>
          <div>
            Poste: <span className="font-medium">{notification.data.position}</span>
          </div>
          <div className="mt-2 text-blue-600 dark:text-blue-400 font-medium">
            Un nouveau candidat a postulé à votre offre
          </div>
        </div>
      )
    }

    if (notification.type === "account_activated") {
      return (
        <div className="text-sm text-muted-foreground mt-2 p-2 sm:p-3 bg-green-50 dark:bg-green-950/30 rounded-md border-l-2 border-green-500">
          <div className="mt-1 text-green-600 dark:text-green-400 font-medium">
            Votre compte a été activé par l'administrateur
          </div>
          <div>Vous pouvez maintenant publier des offres d'emploi</div>
        </div>
      )
    }

    if (notification.type === "offer_rejected") {
      return (
        <div className="text-sm text-muted-foreground mt-2 p-2 sm:p-3 bg-red-50 dark:bg-red-950/30 rounded-md border-l-2 border-red-500">
          <div>
            Poste: <span className="font-medium">{notification.data.position}</span>
          </div>
          <div>
            Département: <span className="font-medium">{notification.data.department}</span>
          </div>
          <div className="mt-2 text-red-600 dark:text-red-400 font-medium">
            Votre offre a été refusée par l'administrateur
          </div>
          {notification.data.reason && (
            <div>
              Raison: <span className="font-medium">{notification.data.reason}</span>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  // Filter notifications based on search query, selected types, and active tab
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(notification.data).toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by type
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(notification.type)

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.read) ||
      (activeTab === "read" && notification.read)

    return matchesSearch && matchesType && matchesTab
  })

  // Group notifications by date
  const groupedNotifications: { [key: string]: any[] } = {}
  filteredNotifications.forEach((notification) => {
    const date = new Date(notification.created_at)
    const dateKey = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })

    if (!groupedNotifications[dateKey]) {
      groupedNotifications[dateKey] = []
    }
    groupedNotifications[dateKey].push(notification)
  })

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedNotifications).sort((a, b) => {
    const dateA = new Date(a.split("/").reverse().join("/"))
    const dateB = new Date(b.split("/").reverse().join("/"))
    return dateB.getTime() - dateA.getTime()
  })

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  // Get unique notification types for filter
  const uniqueTypes = [...new Set(notifications.map((n) => n.type))]

  return (
    <div className="container max-w-5xl py-4 sm:py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge className={"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"}>
              {unreadCount} non lues
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            className={
              "text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950 w-full sm:w-auto"
            }
          >
            <Bell className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto mb-2 sm:mb-0">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer par type
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {uniqueTypes.map((type) => (
              <DropdownMenuItem key={type} onClick={() => handleTypeToggle(type)}>
                <div className="flex items-center w-full">
                  <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => {}} className="mr-2" />
                  {getNotificationTitle(type)}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 gap-1">
              <TabsTrigger className="px-4" value="all">
                Toutes
              </TabsTrigger>
              <TabsTrigger className="px-4" value="unread">
                Non lues
              </TabsTrigger>
              <TabsTrigger className="px-4" value="read">
                Lues
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Card>
        <CardHeader className={"bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"}>
          <CardTitle className={"text-blue-700 dark:text-blue-300"}>Historique des notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground text-center">Aucune notification à afficher</p>
              <p className="text-muted-foreground text-center text-sm mt-1">
                {selectedTypes.length === 0 || searchQuery
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Vous n'avez pas encore reçu de notifications"}
              </p>
            </div>
          ) : (
            <>
              {sortedDates.map((dateKey) => (
                <div key={dateKey}>
                  <div className="sticky top-0 z-10 px-4 py-2 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/60 font-medium text-sm">
                    {dateKey}
                  </div>
                  <div className="divide-y">
                    {groupedNotifications[dateKey].map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 ${"hover:bg-blue-50/50 dark:hover:bg-blue-950/30"} cursor-pointer transition-colors ${!notification.read ? "bg-blue-50/70 dark:bg-blue-950/50" : ""}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${!notification.read ? "bg-blue-500" : "bg-transparent"}`}
                          />
                          <div className="w-full">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <h3 className={"font-medium text-blue-700 dark:text-blue-300"}>
                                {getNotificationTitle(notification.type)}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDate(notification.created_at)}
                                </span>
                                {!notification.read && (
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"}`}
                                  >
                                    Nouveau
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="mt-1">{notification.message}</p>
                            {renderNotificationDetails(notification)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
