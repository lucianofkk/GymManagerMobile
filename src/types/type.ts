// src/types/type.ts

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Masculino' | 'Femenino';
  phoneNumber?: string;
  isActive: boolean;
  plan?: string; // Basic, Standard, Premium
  joinDate?: string; // YYYY-MM-DD
  nextPaymentDate?: string; // YYYY-MM-DD
  daysUntilExpiration?: number;
  email?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque';
  status: 'paid' | 'pending' | 'overdue';
  notes?: string;
}

export interface Plan {
  id: string;
  name: string; // Basic, Standard, Premium
  price: number;
  description: string;
  benefits: string[];
}

export interface Penalty {
  id: string;
  clientId: string;
  amount: number;
  reason: string;
  date: string; // YYYY-MM-DD
  paid: boolean;
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  expiringThisWeek: number;
  monthlyIncome: number;
  newClientsThisMonth: number;
}

export interface RecentActivity {
  id: string;
  type: 'payment' | 'new_client' | 'renewal' | 'expiring';
  clientName: string;
  amount?: number;
  date: string;
  clientId: string;
}