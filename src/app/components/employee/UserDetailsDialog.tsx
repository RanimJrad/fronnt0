"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  created_at: string;
  departement: string;
  numTel: string;
  poste: string;
  adresse: string;
  image?: string;
  cv?: string;
}

interface UserDetailsDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsDialog({
  user,
  isOpen,
  onClose,
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails du recruteur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {user.image && (
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={`http://127.0.0.1:8000/${user.image}`}
                  alt={`Photo de ${user.nom}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {[
            { id: "nom", label: "Nom" },
            { id: "prenom", label: "Prénom" },
            { id: "email", label: "Email" },
            { id: "departement", label: "Département" },
            { id: "numTel", label: "Téléphone" },
            { id: "poste", label: "Poste" },
            { id: "adresse", label: "Adresse" },
          ].map(({ id, label }) => (
            <div key={id} className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">{label}</Label>
              <div className="col-span-3 text-sm">
                {(user as any)[id] || "Non renseigné"}
              </div>
            </div>
          ))}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Date d'inscription</Label>
            <div className="col-span-3 text-sm">
              {new Intl.DateTimeFormat("fr-FR").format(
                new Date(user.created_at)
              )}
            </div>
          </div>

          {user.cv && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">CV</Label>
              <div className="col-span-3">
                <a
                  href={`http://127.0.0.1:8000/${user.cv}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Voir le CV
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
