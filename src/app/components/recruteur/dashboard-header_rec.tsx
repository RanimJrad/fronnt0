"use client"

import { useEffect, useState } from "react"
import { Search, Bell, MessageSquare, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MobileSidebarRec } from "./mobile-sidebar-rec"
import { useNotifications } from "@/app/hooks/use-notifications"

interface UserProps {
  nom: string
  prenom: string
  image: string | null
  nom_societe?: string
  role?: string
}

export function DashboardHeaderRec() {
  const [user, setUser] = useState<UserProps | null>(null)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  useEffect(() => {
    // Fetch user info
    fetch("http://localhost:8000/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Erreur lors de la récupération des infos utilisateur :", error))
  }, [])

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)

    // Handle navigation based on notification type
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
    switch (type) {
      case "offer_validated":
        return "Offre validée"
      case "new_application":
        return "Nouvelle candidature"
      case "account_activated":
        return "Compte activé"
      case "offer_rejected":
        return "Offre refusée"
      default:
        return "Notification"
    }
  }

  // Function to render notification details based on type
  const renderNotificationDetails = (notification: any) => {
    switch (notification.type) {
      case "offer_validated":
        return (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-md border-l-2 border-green-500">
            <div>
              Poste: <span className="font-medium">{notification.data.position}</span>
            </div>
            <div>
              Département: <span className="font-medium">{notification.data.department}</span>
            </div>
            <div className="mt-1 text-green-600 dark:text-green-400 font-medium">
              Votre offre est maintenant visible par les candidats
            </div>
          </div>
        )
      case "new_application":
        return (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md border-l-2 border-blue-500">
            <div>
              Candidat: <span className="font-medium">{notification.data.candidate_name}</span>
            </div>
            <div>
              Poste: <span className="font-medium">{notification.data.position}</span>
            </div>
            <div className="mt-1 text-blue-600 dark:text-blue-400 font-medium">
              Un nouveau candidat a postulé à votre offre
            </div>
          </div>
        )
      case "account_activated":
        return (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-md border-l-2 border-green-500">
            <div className="mt-1 text-green-600 dark:text-green-400 font-medium">
              Votre compte a été activé par l'administrateur
            </div>
            <div>Vous pouvez maintenant publier des offres d'emploi</div>
          </div>
        )
      case "offer_rejected":
        return (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-red-50 dark:bg-red-950/30 rounded-md border-l-2 border-red-500">
            <div>
              Poste: <span className="font-medium">{notification.data.position}</span>
            </div>
            <div>
              Département: <span className="font-medium">{notification.data.department}</span>
            </div>
            <div className="mt-1 text-red-600 dark:text-red-400 font-medium">
              Votre offre a été refusée par l'administrateur
            </div>
            {notification.data.reason && (
              <div>
                Raison: <span className="font-medium">{notification.data.reason}</span>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  // Ajouter la fonction handleLogout
  const handleLogout = () => {
    // Appel à l'API de déconnexion
    fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        // Supprimer le token localement
        sessionStorage.removeItem("token")

        // Rediriger vers la page d'accueil
        window.location.href = "/"
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error)
        // En cas d'erreur, on supprime quand même le token et on redirige
        sessionStorage.removeItem("token")
        window.location.href = "/"
      })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Mobile sidebar trigger */}
          <MobileSidebarRec />

          <a href="/dashbord_rec" className="flex items-center space-x-2">
            <img src="/Logo.jpeg" alt="Logo" className="h-10 w-auto" />
            <span className="font-bold hidden sm:inline">Recruter Dashboard</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile search trigger */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Message Icon */}
          <Button variant="ghost" size="icon" className="relative" onClick={() => (window.location.href = "/chatRec")}>
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-xs bg-red-500 text-white border-0">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px] p-0 rounded-xl shadow-lg border-0">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-t-xl">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications?.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                    <p className="text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  notifications?.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-4 cursor-pointer border-b last:border-b-0 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors ${!notification.read ? "bg-blue-50/70 dark:bg-blue-950/50" : ""}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3 w-full">
                        <div
                          className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${!notification.read ? "bg-blue-500" : "bg-transparent"}`}
                        />
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-start justify-between">
                            <span className="font-medium text-blue-700 dark:text-blue-300">
                              {getNotificationTitle(notification.type)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatDate(notification.created_at)}
                            </span>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                          {renderNotificationDetails(notification)}
                          {!notification.read && (
                            <div className="flex justify-end mt-2">
                              <Badge
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              >
                                Nouveau
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              {notifications?.length > 0 && (
                <div className="p-3 border-t bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-b-xl">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white hover:bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-800"
                    onClick={() => (window.location.href = "/notifications_rec")}
                  >
                    Voir toutes les notifications
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <img
                  src={user?.image || "/placeholder.svg?height=40&width=40"}
                  alt="Avatar"
                  className="rounded-full object-cover h-10 w-10"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-0 rounded-xl shadow-lg border-0">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.image || "/placeholder.svg?height=60&width=60"}
                    alt="Avatar"
                    className="rounded-full object-cover h-14 w-14 border-2 border-white shadow-md dark:border-gray-800"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300">
                      {user?.prenom} {user?.nom}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{user?.nom_societe}</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2 cursor-pointer rounded-md"
                  onClick={() => (window.location.href = "/profile")}
                >
                  <User className="h-4 w-4" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2 cursor-pointer rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
