"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, Check } from "lucide-react"

interface User {
  id: number
  nom: string
  prenom: string
  email: string
  created_at: string
  departement: string
  numTel: string
  poste:string
}

export function ReviewsTable() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Erreur de récupération des utilisateurs", error))
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Prenom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Departement</TableHead>
          <TableHead>Poste</TableHead>
          <TableHead>Telephone</TableHead>
          <TableHead>Date d'inscription</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.nom}</TableCell>
            <TableCell className="font-medium">{user.prenom}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.departement}</TableCell>
            <TableCell className="font-medium">{user.poste}</TableCell>
            <TableCell className="font-medium">{user.numTel}</TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
