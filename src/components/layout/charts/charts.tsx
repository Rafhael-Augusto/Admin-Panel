"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { chartData } from "@/lib/mock-data";

import { useUser } from "@/hooks/useData/users";

type MonthlyCount = { month: string; count: number };

export function Charts() {
  const [usersSeparated, setUsersSeparated] = useState<MonthlyCount[]>([]);

  const { getUsers } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const usersList = await getUsers();

      const separatedUsers = groupByMonth(usersList);

      setUsersSeparated(separatedUsers);
    };

    fetchData();
  }, []);

  const groupByMonth = (items: User[]): MonthlyCount[] => {
    const counts: Record<string, number> = {};

    items.forEach((item) => {
      const rawDate = item.createdAt;
      const date = new Date(rawDate);

      if (isNaN(date.getTime())) {
        console.warn("Data inválida:", rawDate);
        return;
      }

      const monthYear = `${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${date.getFullYear()}`;

      counts[monthYear] = (counts[monthYear] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const [ma, ya] = a.month.split("-").map(Number);
        const [mb, yb] = b.month.split("-").map(Number);
        return ya !== yb ? ya - yb : ma - mb;
      });
  };

  const formatMonth = (monthStr: string) => {
    const [m, y] = monthStr.split("-").map(Number);
    const monthNames = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${monthNames[m - 1]} ${y}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="vendas"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Novos Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersSeparated}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={formatMonth} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
