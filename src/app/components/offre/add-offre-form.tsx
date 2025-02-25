"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddOffreFormProps {
  onOffreAdded: () => void
}

export function AddOffreForm({ onOffreAdded }: { onOffreAdded: () => void }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userDepartement, setUserDepartement] = useState<string>("")

  const [formData, setFormData] = useState({
    departement: "",
    poste: "",
    description: "",
    dateExpiration: "",
  })

  // Récupérer le département de l'utilisateur connecté
  useEffect(() => {
    const fetchUserDepartement = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Vous devez être connecté pour ajouter une offre.")
          router.push("/auth/login")
          return
        }

        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token")
            router.push("/auth/login")
            return
          }
          throw new Error("Erreur lors de la récupération des informations utilisateur")
        }

        const userData = await response.json()
        setUserDepartement(userData.departement)
        setFormData((prev) => ({
          ...prev,
          departement: userData.departement,
        }))
      } catch (error) {
        console.error("Erreur:", error)
        setError("Erreur lors de la récupération du département")
      }
    }

    if (isOpen) {
      fetchUserDepartement()
    }
  }, [isOpen, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Vous devez être connecté pour ajouter une offre.")
        return
      }

      const response = await fetch("http://127.0.0.1:8000/api/addOffres", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue lors de l'ajout de l'offre.")
        return
      }

      setSuccess("Offre ajoutée avec succès !")

      // Réinitialiser le formulaire tout en conservant le département
      setFormData({
        departement: userDepartement,
        poste: "",
        description: "",
        dateExpiration: "",
      })

      // Appeler onOffreAdded immédiatement pour rafraîchir la table
      onOffreAdded()

      // Fermer le dialogue après un délai
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(null)
      }, 2000)
    } catch (error) {
      setError("Erreur lors de l'ajout de l'offre.")
    } finally {
      setLoading(false)
    }
  }

  // Obtenir la date minimum (aujourd'hui) pour le champ date d'expiration
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une offre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une offre</DialogTitle>
          <DialogDescription>Remplissez les informations de la nouvelle offre d'emploi.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Département - Désactivé et pré-rempli */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departement" className="text-right">
                Département
              </Label>
              <Input
                id="departement"
                name="departement"
                value={formData.departement}
                className="col-span-3 bg-muted"
                disabled
              />
            </div>

            {/* Poste */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="poste" className="text-right">
                Poste
              </Label>
              <Input
                id="poste"
                name="poste"
                value={formData.poste}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3 min-h-[100px]"
                required
              />
            </div>

            {/* Date d'expiration */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateExpiration" className="text-right">
                Date d'expiration
              </Label>
              <Input
                id="dateExpiration"
                name="dateExpiration"
                type="date"
                min={today}
                value={formData.dateExpiration}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout en cours..." : "Ajouter l'offre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

