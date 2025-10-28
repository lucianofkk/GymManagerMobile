// src/services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client, Payment } from '../types/type';

// Datos iniciales mock
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    firstName: 'Luciano',
    lastName: 'Frias-Klein',
    gender: 'Masculino',
    phoneNumber: '3644719299',
    isActive: true,
    plan: 'Premium',
    joinDate: '2024-01-15',
    nextPaymentDate: '2025-10-15',
    daysUntilExpiration: 2,
  },
  {
    id: '2',
    firstName: 'Lucia',
    lastName: 'Asselborn',
    gender: 'Femenino',
    phoneNumber: '3644555555',
    isActive: false,
    plan: 'Standard',
    joinDate: '2024-03-20',
    nextPaymentDate: '2025-09-20',
    daysUntilExpiration: -23,
  },
  {
    id: '3',
    firstName: 'Delmiro',
    lastName: 'Obregon',
    gender: 'Masculino',
    phoneNumber: '3644666666',
    isActive: true,
    plan: 'Basic',
    joinDate: '2024-06-10',
    nextPaymentDate: '2025-10-20',
    daysUntilExpiration: 7,
  },
  {
    id: '4',
    firstName: 'María',
    lastName: 'González',
    gender: 'Femenino',
    phoneNumber: '3644777777',
    isActive: true,
    plan: 'Premium',
    joinDate: '2024-02-05',
    nextPaymentDate: '2025-10-10',
    daysUntilExpiration: -3,
  },
  {
    id: '5',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    gender: 'Masculino',
    phoneNumber: '3644888888',
    isActive: true,
    plan: 'Standard',
    joinDate: '2024-04-12',
    nextPaymentDate: '2025-10-30',
    daysUntilExpiration: 17,
  },
];

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    clientId: '1',
    amount: 8500,
    date: '2025-10-13',
    method: 'Transferencia',
    status: 'paid',
  },
  {
    id: '2',
    clientId: '2',
    amount: 6500,
    date: '2025-10-12',
    method: 'Efectivo',
    status: 'paid',
  },
  {
    id: '3',
    clientId: '3',
    amount: 5000,
    date: '2025-10-11',
    method: 'Tarjeta',
    status: 'pending',
  },
];

const STORAGE_KEYS = {
  CLIENTS: 'gym_clients',
  PAYMENTS: 'gym_payments',
  STATS: 'gym_stats',
};

// ============ CLIENTES ============

export const initializeClients = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!existing) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CLIENTS,
        JSON.stringify(MOCK_CLIENTS)
      );
    }
  } catch (error) {
    console.error('Error initializing clients:', error);
  }
};

export const getClients = async (): Promise<Client[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

export const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  try {
    const clients = await getClients();
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      nextPaymentDate: new Date().toISOString().split('T')[0],
      daysUntilExpiration: 30,
    };
    clients.push(newClient);
    await AsyncStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    return newClient;
  } catch (error) {
    console.error('Error adding client:', error);
    throw error;
  }
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
  try {
    const clients = await getClients();
    const index = clients.findIndex((c) => c.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    }
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    const clients = await getClients();
    const filtered = clients.filter((c) => c.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const clients = await getClients();
    return clients.find((c) => c.id === id) || null;
  } catch (error) {
    console.error('Error fetching client by id:', error);
    return null;
  }
};

// ============ PAGOS ============

export const initializePayments = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!existing) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PAYMENTS,
        JSON.stringify(MOCK_PAYMENTS)
      );
    }
  } catch (error) {
    console.error('Error initializing payments:', error);
  }
};

export const getPayments = async (): Promise<Payment[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

export const addPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  try {
    const payments = await getPayments();
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
    };
    payments.push(newPayment);
    await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    
    // Actualizar el estado del cliente
    await updateClient(payment.clientId, { isActive: true });
    
    return newPayment;
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};

export const getPaymentsByClientId = async (clientId: string): Promise<Payment[]> => {
  try {
    const payments = await getPayments();
    return payments.filter((p) => p.clientId === clientId);
  } catch (error) {
    console.error('Error fetching payments by client:', error);
    return [];
  }
};

export const updatePayment = async (id: string, updates: Partial<Payment>): Promise<void> => {
  try {
    const payments = await getPayments();
    const index = payments.findIndex((p) => p.id === id);
    if (index !== -1) {
      payments[index] = { ...payments[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    }
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

// ============ ESTADÍSTICAS ============

export const getDashboardStats = async () => {
  try {
    const clients = await getClients();
    const payments = await getPayments();
    
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const activeClients = clients.filter((c) => c.isActive).length;
    const expiringThisWeek = clients.filter((c) => {
      const days = c.daysUntilExpiration || 0;
      return days >= 0 && days <= 7;
    }).length;
    
    const monthlyIncome = payments
      .filter((p) => {
        const payDate = new Date(p.date);
        return payDate >= monthStart && payDate <= today;
      })
      .reduce((sum, p) => sum + p.amount, 0);
    
    const newClientsThisMonth = clients.filter((c) => {
      const joinDate = new Date(c.joinDate || '');
      return joinDate >= monthStart && joinDate <= today;
    }).length;
    
    return {
      totalClients: clients.length,
      activeClients,
      expiringThisWeek,
      monthlyIncome,
      newClientsThisMonth,
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    return {
      totalClients: 0,
      activeClients: 0,
      expiringThisWeek: 0,
      monthlyIncome: 0,
      newClientsThisMonth: 0,
    };
  }
};

// ============ UTILIDADES ============

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CLIENTS,
      STORAGE_KEYS.PAYMENTS,
      STORAGE_KEYS.STATS,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

export const resetToMockData = async (): Promise<void> => {
  try {
    await clearAllData();
    await initializeClients();
    await initializePayments();
  } catch (error) {
    console.error('Error resetting to mock data:', error);
  }
};