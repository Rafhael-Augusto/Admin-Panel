"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/shared/loadingScreen";
import { Product, User } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { UserForm } from "@/components/layout";

import { useUser } from "@/hooks/useData/users";
import { useSearch } from "@/hooks/useSearch";
import { useFormattedDate } from "@/hooks/useFormattedData";

import { Input } from "@/components/ui/input";

export function UsersTable() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [updatedUsers, setUpdatedUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);

  const { getUsers, deleteUserFirebase } = useUser();
  const { FilterByName, FilterByStatus, FilterByDate } = useSearch();
  const { formatDate } = useFormattedDate();

  const fetchUsers = async () => {
    const usersList = await getUsers();
    setUpdatedUsers(usersList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOriginal = async () => {
      const users = await getUsers();
      setOriginalUsers(users);
    };

    fetchOriginal();
  }, [getUsers]);

  const onUserEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const onFormDelete = (userId: string) => {
    deleteUserFirebase(userId);
    fetchUsers();
  };

  const onFormClose = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);

    fetchUsers();
  };

  const handleFilter = async (words: string) => {
    if (!words) {
      fetchUsers();

      return;
    }

    const updatedList = FilterByName(words, originalUsers);
    setUpdatedUsers(updatedList as User[]);
  };

  const sortList = (sort: string) => {
    let filteredList: (User | Product)[];

    switch (sort) {
      case "status":
        filteredList = FilterByStatus(updatedUsers);
        break;
      case "date":
        filteredList = FilterByDate(updatedUsers);
        break;
      default:
        return;
    }

    setUpdatedUsers(filteredList as User[]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Usuários</h2>

        <div className="flex gap-5">
          <Input
            onChange={(e) => handleFilter(e.target.value)}
            className="bg-primary selection:bg-cyan-950 shadow-xs hover:bg-primary/95 text-white"
            placeholder="🔍 Buscar..."
          />
          <Button
            className="cursor-pointer"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {updatedUsers[0] ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-300 w-full">
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead
                  onClick={() => sortList("status")}
                  className="cursor-pointer hover:bg-gray-400"
                >
                  Status
                </TableHead>
                <TableHead
                  onClick={() => sortList("date")}
                  className="cursor-pointer hover:bg-gray-400"
                >
                  Data de Criação
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updatedUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                    >
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="icon"
                        onClick={() => onUserEdit(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="icon"
                        onClick={() => onFormDelete(user.id ? user.id : "")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <LoadingScreen />
      )}

      <UserForm user={editingUser} isOpen={isFormOpen} onClose={onFormClose} />
    </div>
  );
}
