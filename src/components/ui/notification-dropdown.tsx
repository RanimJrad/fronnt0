"use client"

import { useState, useEffect } from "react"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: number
  message: string
  offreId: number
  offrePoste: string
  read: boolean
  createdAt: string
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    fetchNotifications()
    
    // Rafraîchir les notifications toutes les 30 minutes
    const interval = setInterval(fetchNotifications, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      const response = await fetch("http://127.0.0.1:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      await fetch(`http://127.0.0.1:8000/api/notifications/${notificationId}/read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      // Mettre à jour l'état local
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ))
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Marquer comme lu
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    // Rediriger vers la page de l'offre (si nécessaire)
    // window.location.href = `/offres/${notification.offreId}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-medium border-b">Notifications</div>
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Chargement...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">Aucune notification</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div>
                  <div className="font-medium">
                    {notification.offrePoste}
                    {!notification.read && (
                      <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleDateString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
