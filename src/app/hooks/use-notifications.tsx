"use client"

import { useState, useEffect, useCallback } from "react"

interface Notification {
  id: number
  type: string
  message: string
  data: any
  read: boolean
  created_at: string
}

// Singleton pattern pour partager l'état des notifications entre les composants
let listeners: Array<() => void> = []
let notificationsState: Notification[] = []
let unreadCountState = 0

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsState)
  const [unreadCount, setUnreadCount] = useState<number>(unreadCountState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  // S'inscrire aux mises à jour
  useEffect(() => {
    const handleChange = () => {
      setNotifications([...notificationsState])
      setUnreadCount(unreadCountState)
    }

    listeners.push(handleChange)

    return () => {
      listeners = listeners.filter((listener) => listener !== handleChange)
    }
  }, [])

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) return

      const response = await fetch("http://127.0.0.1:8000/api/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      const notificationsArray = Array.isArray(data) ? data : data?.notifications || []

      // Mettre à jour l'état global
      notificationsState = notificationsArray
      unreadCountState = notificationsArray.filter((n: Notification) => !n.read).length || 0
      notifyListeners()

      setLoading(false)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications")
      setLoading(false)
    }
  }, [])

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) return false

      const response = await fetch(`http://127.0.0.1:8000/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Mettre à jour l'état global
      notificationsState = notificationsState.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      unreadCountState = Math.max(0, unreadCountState - 1)
      notifyListeners()

      return true
    } catch (error) {
      console.error("Error marking notification as read:", error)
      return false
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) return false

      const response = await fetch("http://127.0.0.1:8000/api/notifications", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Mettre à jour l'état global
      notificationsState = notificationsState.map((notification) => ({ ...notification, read: true }))
      unreadCountState = 0
      notifyListeners()

      return true
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      return false
    }
  }, [])

  // Fonction pour ajouter une notification localement (après une action utilisateur)
  const addLocalNotification = useCallback((notification: Omit<Notification, "id" | "created_at">) => {
    // Générer un ID temporaire (négatif pour éviter les conflits avec les IDs du serveur)
    const tempId = -Date.now()

    // Créer une notification complète
    const newNotification: Notification = {
      ...notification,
      id: tempId,
      created_at: new Date().toISOString(),
      read: false,
    }

    // Ajouter au début de la liste
    notificationsState = [newNotification, ...notificationsState]
    unreadCountState += 1
    notifyListeners()

    // Retourner l'ID temporaire au cas où nous voudrions le mettre à jour plus tard
    return tempId
  }, [])

  // Initialize WebSocket connection
  useEffect(() => {
    const token = sessionStorage.getItem("token")
    if (!token) return

    // Fetch initial notifications
    fetchNotifications()

    // Try to establish WebSocket connection
    try {
      // Create WebSocket connection
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications?token=${token}`)

      ws.onopen = () => {
        console.log("WebSocket connection established")
        setSocket(ws)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "notification") {
            // Add new notification to the global state
            notificationsState = [data.notification, ...notificationsState]
            unreadCountState += 1
            notifyListeners()
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error)
        }
      }

      ws.onerror = (error) => {
        // Fall back to polling if WebSocket fails
        startPolling()
      }

      ws.onclose = () => {
        console.log("WebSocket connection closed")
        setSocket(null)
        // Fall back to polling if WebSocket closes
        startPolling()
      }

      return () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close()
        }
      }
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error)
      // Fall back to polling
      startPolling()
    }
  }, [fetchNotifications])

  // Fallback polling mechanism if WebSocket fails
  const startPolling = useCallback(() => {
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    addLocalNotification,
    isConnected: !!socket && socket.readyState === WebSocket.OPEN,
  }
}
