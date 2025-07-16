export interface User {
  id?: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive";
  createdAt: string;
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
}
