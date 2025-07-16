"use client";

import { useState } from "react";
import { BarChart3, Users, Package, Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "users", label: "Usuários", icon: Users },
  { id: "products", label: "Produtos", icon: Package },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-gray-900 text-white transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-gray-800 cursor-pointer"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-800 hover:text-cyan-400 cursor-pointer",
                    activeTab === item.id && "bg-gray-800 text-cyan-400",
                    isCollapsed && "px-2"
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
