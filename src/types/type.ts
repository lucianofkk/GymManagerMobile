// src/types/type.ts

// ============ CLIENTS ============
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // Opcional
  gender: 'Masculino' | 'Femenino';
  isActive: boolean;
}

// ============ MEMBERSHIP PLANS ============
export interface MembershipPlan {
  id: string;
  planName: string;
  duration: number; // Días de duración
  price: number;
  description: string;
  isActive: boolean;
}

// ============ SUBSCRIPTIONS ============
export interface Subscription {
  id: string;
  clientId: string; // Reference to Client
  planId: string; // Reference to MembershipPlan
  startDate: Date;
  endDate: Date;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lateFee: number;
}

// ============ PAYMENTS ============
export interface Payment {
  id: string;
  clientId: string; // Reference to Client
  subscriptionId: string; // Reference to Subscription
  amount: number;
  paymentDate: Date;
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque';
}

// ============ TIPOS EXTENDIDOS PARA LA UI ============

// Cliente con información de suscripción (para mostrar en la UI)
export interface ClientWithSubscription extends Client {
  currentPlan?: MembershipPlan;
  subscription?: Subscription;
  daysUntilExpiration?: number;
  nextPaymentDate?: Date;
}

// ============ DASHBOARD STATS ============
export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  expiringThisWeek: number;
  monthlyIncome: number;
  newClientsThisMonth: number;
}

// ============ RECENT ACTIVITY ============
export interface RecentActivity {
  id: string;
  type: 'payment' | 'new_client' | 'renewal' | 'expiring';
  clientName: string;
  amount?: number;
  date: string;
  clientId: string;
}