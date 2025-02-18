import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  
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
  
  export function ArchiveTable({ refresh }: { refresh: boolean }) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchArchivedUsers = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Vous devez être connecté pour voir les utilisateurs.");
            return;
          }
  
          const response = await fetch("http://127.0.0.1:8000/api/users/archived", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            if (response.status === 401) {
              localStorage.removeItem("token");
              router.push("/auth/login");
              return;
            }
            throw new Error("Erreur de récupération des utilisateurs archivés");
          }
  
          const data = await response.json();
          setUsers(data); // Affichage des utilisateurs archivés
          setError(null);
        } catch (error) {
          console.error("Erreur de récupération des utilisateurs archivés:", error);
          setError("Erreur lors du chargement des utilisateurs");
        } finally {
          setLoading(false);
        }
      };
  
      fetchArchivedUsers();
    }, [refresh]);
  
    if (loading) return <div className="p-4 text-gray-600">Chargement...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
  
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Date d'inscription</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.email}
                  </a>
                </TableCell>
                <TableCell>{user.departement}</TableCell>
                <TableCell>{user.poste}</TableCell>
                <TableCell>{user.numTel}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("fr-FR").format(
                    new Date(user.created_at)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }
  