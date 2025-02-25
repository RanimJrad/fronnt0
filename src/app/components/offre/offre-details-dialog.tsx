"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Offre {
  id: number
  departement: string
  poste: string
  description: string
  datePublication: string
  dateExpiration: string
  valider: boolean
}

interface OffreDetailsDialogProps {
  offre: Offre | null
  isOpen: boolean
  onClose: () => void
}

export function OffreDetailsDialog({
  offre,
  isOpen,
  onClose,
}: OffreDetailsDialogProps) {
  if (!offre) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de l'offre</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Affichage des informations de l'offre */}
          {[
            { id: "departement", label: "Département" },
            { id: "poste", label: "Poste" },
            { id: "description", label: "Description" },
          ].map(({ id, label }) => (
            <div key={id} className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">{label}</Label>
              <div className="col-span-3 text-sm">
                {(offre as any)[id] || "Non renseigné"}
              </div>
            </div>
          ))}

          {/* Dates */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Date de publication</Label>
            <div className="col-span-3 text-sm">
              {new Intl.DateTimeFormat("fr-FR").format(
                new Date(offre.datePublication)
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Date d'expiration</Label>
            <div className="col-span-3 text-sm">
              {new Intl.DateTimeFormat("fr-FR").format(
                new Date(offre.dateExpiration)
              )}
            </div>
          </div>

          {/* Statut */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Statut</Label>
            <div className="col-span-3">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  offre.valider
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {offre.valider ? "Validée" : "En attente"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
