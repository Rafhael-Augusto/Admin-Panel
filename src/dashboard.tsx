"use client";

import { useState } from "react";

import {
  Charts,
  ProductsTable,
  Sidebar,
  StatsCards,
  UsersTable,
} from "@/components/layout";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-8 ">Dashboard</h1>
            <StatsCards />
            <Charts />
          </div>
        );
      case "users":
        return <UsersTable />;
      case "products":
        return <ProductsTable />;
      case "analytics":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-8">Analytics</h1>
            <Charts />
          </div>
        );
      case "settings":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-8">Configurações</h1>
            <p className="text-gray-600">
              Configurações do sistema em desenvolvimento...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
}
