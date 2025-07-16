"use client";

import { useUser } from "@/hooks/useData/users";
import { useProduct } from "@/hooks/useData/products";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, DollarSign, ShoppingCart } from "lucide-react";
import { mockStats } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { Product, User } from "@/types";

export function StatsCards() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const { getUsers } = useUser();
  const { getProducts } = useProduct();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getUsers();
      const productsList = await getProducts();

      setUsers(usersList);
      setProducts(productsList);
    };

    fetchUsers();
  }, [getProducts, getUsers]);

  const stats = [
    {
      title: "Total de Usuários",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Produtos",
      value: products.length,
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Receita Total",
      value: `R$ ${mockStats.totalRevenue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: "Pedidos",
      value: mockStats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
