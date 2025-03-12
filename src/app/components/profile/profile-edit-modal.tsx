"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface UserData {
  id: number
  email: string
  departement?: string
  nom: string
  prenom: string
  numTel?: string
  password?: string
  poste?: string
  adresse?: string
  image?: string
  cv?: string
  nom_societe?: string
  role?: string
}

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  userData: UserData | null
  onSuccess: () => void
}

export default function ProfileEditModal({ isOpen, onClose, userData, onSuccess }: ProfileEditModalProps) {
  const [formData, setFormData] = useState<UserData | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)

  // Initialize form data when modal opens
  useEffect(() => {
    if (userData) {
      setFormData({
        ...userData,
        password: "", // Clear password field for security
      })
      setImagePreview(userData.image || null)
      setCvFileName(userData.cv ? extractFileName(userData.cv) : null)
    }
  }, [userData, isOpen])

  const extractFileName = (url: string): string => {
    const parts = url.split("/")
    return parts[parts.length - 1]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCvFile(file)
      setCvFileName(file.name)
    }
  }

  const triggerImageUpload = () => {
    imageInputRef.current?.click()
  }

  const triggerCvUpload = () => {
    cvInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token non trouvé")

      // Create FormData object for file uploads
      const submitData = new FormData()

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && key !== "cv" && key !== "role" && value !== undefined) {
          submitData.append(key, value.toString())
        }
      })

      // Add files if selected
      if (imageFile) {
        submitData.append("image", imageFile)
      }

      if (cvFile) {
        submitData.append("cv", cvFile)
      }

      // Log the data being sent for debugging
      console.log("Sending data to API:", Object.fromEntries(submitData.entries()))

      // Make sure the URL matches exactly what's defined in your Laravel routes
      const response = await fetch(`http://127.0.0.1:8000/api/user/updateRec/${formData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type when using FormData
        },
        body: submitData,
      })

      const responseData = await response.json()
      console.log("API Response:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Erreur lors de la mise à jour du profil")
      }

      // Success
      onSuccess()
      onClose()
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier votre profil</DialogTitle>
        </DialogHeader>

        {error && <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-4 overflow-hidden border border-gray-200 rounded-full">
              {imagePreview ? (
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Photo de profil"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <span className="text-gray-400">Photo</span>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerImageUpload}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Changer la photo
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" name="prenom" value={formData?.prenom || ""} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" name="nom" value={formData?.nom || ""} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData?.email || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numTel">Téléphone</Label>
              <Input id="numTel" name="numTel" value={formData?.numTel || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poste">Poste</Label>
              <Input id="poste" name="poste" value={formData?.poste || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
              <Input
                id="departement"
                name="departement"
                value={formData?.departement || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" name="adresse" value={formData?.adresse || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom_societe">Entreprise</Label>
              <Input
                id="nom_societe"
                name="nom_societe"
                value={formData?.nom_societe || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">Mot de passe (laisser vide pour ne pas modifier)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData?.password || ""}
                onChange={handleInputChange}
                placeholder="Nouveau mot de passe"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cv">CV (PDF)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={cvInputRef}
                  onChange={handleCvChange}
                  accept="application/pdf"
                  className="hidden"
                />

                <Button type="button" variant="outline" onClick={triggerCvUpload} className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {cvFile ? "Changer le CV" : "Télécharger un CV"}
                </Button>

                {cvFileName && <span className="text-sm text-gray-600 truncate max-w-[200px]">{cvFileName}</span>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

