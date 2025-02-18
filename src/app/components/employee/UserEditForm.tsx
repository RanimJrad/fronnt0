// UserEditForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "./ReviewsTable" ; // Ensure this import path is correct

interface UserEditFormProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedUser: User) => void;
}

export function UserEditForm({ user, isOpen, onClose, onSubmit }: UserEditFormProps) {
  const [updatedUser, setUpdatedUser] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prev: User) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(updatedUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le recruteur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Formulaire de modification */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Nom</Label>
            <div className="col-span-3 text-sm">{user.nom}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Prénom</Label>
            <div className="col-span-3 text-sm">{user.prenom}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Email</Label>
            <div className="col-span-3 text-sm">{user.email}</div>
          </div>

          {/* Champs modifiables */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Département</Label>
            <Input
              className="col-span-3"
              type="text"
              name="departement"
              value={updatedUser.departement}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Poste</Label>
            <Input
              className="col-span-3"
              type="text"
              name="poste"
              value={updatedUser.poste}
              onChange={handleChange}
            />
          </div>

          {/* Téléphone */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Téléphone</Label>
            <div className="col-span-3 text-sm">{user.numTel}</div>
          </div>

          {/* Adresse */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Adresse</Label>
            <div className="col-span-3 text-sm">{user.adresse}</div>
          </div>

          {/* Boutons de soumission */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit}>Enregistrer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
