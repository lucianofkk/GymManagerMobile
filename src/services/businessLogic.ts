// src/services/businessLogic.ts - VERSIÓN CORREGIDA
/**
 * 🔧 CAMBIOS:
 * - expiringThisWeek ahora usa getActiveSubscription (una por cliente)
 * - Evita contar múltiples suscripciones del mismo cliente
 */

import {
  ClientWithSubscription,
  DashboardStats,
} from '../types/type';
import { getClients } from './clientService';
import { getMembershipPlanById } from './membershipPlansService';
import { getPayments } from './paymentService';
import { getActiveSubscription } from './subscriptionsService';

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════

const safeToDate = (timestamp: any): Date | null => {
  if (!timestamp) return null;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return null;
};

export const calculateDaysUntilExpiration = (endDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateLateFee = (endDate: Date): number => {
  const daysOverdue = -calculateDaysUntilExpiration(endDate);
  if (daysOverdue <= 0) return 0;
  return daysOverdue * 500;
};

const getSubscriptionStatus = (
  endDate: Date,
  paymentStatus: string
): 'paid' | 'pending' | 'overdue' => {
  const days = calculateDaysUntilExpiration(endDate);

  if (days < 0) {
    return 'overdue';
  }

  if (paymentStatus === 'paid') {
    return 'paid';
  }

  return 'pending';
};

// ═══════════════════════════════════════════════════════════════════════════
// CLIENTES CON SUSCRIPCIÓN
// ═══════════════════════════════════════════════════════════════════════════

export const getClientsWithSubscription = async (): Promise<ClientWithSubscription[]> => {
  try {
    const clients = await getClients();

    const clientsWithSub = await Promise.all(
      clients.map(async (client) => {
        if (!client.id) {
          throw new Error('Cliente sin ID encontrado');
        }

        // ✅ Obtener SOLO la suscripción activa (la más reciente)
        const activeSubscription = await getActiveSubscription(client.id);

        if (!activeSubscription) {
          return {
            id: client.id,
            firstName: client.firstName,
            lastName: client.lastName,
            phoneNumber: client.phoneNumber,
            gender: client.gender,
            isActive: client.isActive,
          } as ClientWithSubscription;
        }

        const startDate = safeToDate(activeSubscription.startDate);
        const endDate = safeToDate(activeSubscription.endDate);

        if (!endDate) {
          console.warn(`⚠️ Suscripción sin endDate para cliente ${client.id}`);
        }

        const plan = await getMembershipPlanById(activeSubscription.planId);
        const daysUntilExpiration = endDate
          ? calculateDaysUntilExpiration(endDate)
          : 0;

        const subscriptionStatus = endDate
          ? getSubscriptionStatus(endDate, activeSubscription.paymentStatus)
          : 'pending';

        return {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          phoneNumber: client.phoneNumber,
          gender: client.gender,
          isActive: client.isActive,
          currentPlan: plan
            ? {
                id: plan.id || '',
                planName: plan.planName,
                price: plan.price,
                duration: plan.duration,
                description: plan.description,
                isActive: plan.isActive,
              }
            : undefined,
          subscription: {
            id: activeSubscription.id || '',
            startDate: startDate || new Date(),
            endDate: endDate || new Date(),
            paymentStatus: subscriptionStatus,
            lateFee:
              endDate && subscriptionStatus === 'overdue'
                ? calculateLateFee(endDate)
                : 0,
          },
          daysUntilExpiration,
          nextPaymentDate: endDate || null,
        } as ClientWithSubscription;
      })
    );

    return clientsWithSub;
  } catch (error) {
    console.error('❌ Error fetching clients with subscriptions:', error);
    throw new Error('No se pudieron cargar los clientes');
  }
};

export const getClientWithSubscription = async (
  clientId: string
): Promise<ClientWithSubscription | null> => {
  try {
    const clients = await getClientsWithSubscription();
    return clients.find((c) => c.id === clientId) || null;
  } catch (error) {
    console.error('❌ Error fetching client with subscription:', error);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS - ARREGLADO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ✅ ARREGLADO: expiringThisWeek ahora cuenta correctamente
 * - Usa getActiveSubscription para evitar contar múltiples suscripciones
 * - Solo cuenta 1 suscripción por cliente
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const clients = await getClients();
    const payments = await getPayments();

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // ✅ Clientes activos (isActive = true)
    const activeClients = clients.filter((c) => c.isActive).length;

    // ✅ ARREGLADO: Contar clientes con vencimiento esta semana
    // (Solo una suscripción por cliente, la activa)
    let expiringThisWeek = 0;
    for (const client of clients) {
      if (!client.id) continue;

      const activeSubscription = await getActiveSubscription(client.id);
      if (!activeSubscription) continue;

      const endDate = safeToDate(activeSubscription.endDate);
      if (!endDate) continue;

      const days = calculateDaysUntilExpiration(endDate);
      if (days >= 0 && days <= 7) {
        expiringThisWeek++;
      }
    }

    // ✅ Ingresos del mes actual
    const monthlyIncome = payments
      .filter((p) => {
        const payDate = new Date(p.paymentDate);
        return payDate >= monthStart && payDate <= today;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    const newClientsThisMonth = 0;

    return {
      totalClients: clients.length,
      activeClients,
      expiringThisWeek, // ✅ AHORA CORRECTO
      monthlyIncome,
      newClientsThisMonth,
    };
  } catch (error) {
    console.error('❌ Error calculating dashboard stats:', error);
    return {
      totalClients: 0,
      activeClients: 0,
      expiringThisWeek: 0,
      monthlyIncome: 0,
      newClientsThisMonth: 0,
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// FILTROS
// ═══════════════════════════════════════════════════════════════════════════

export const getExpiringClients = async (
  daysThreshold: number = 7
): Promise<ClientWithSubscription[]> => {
  const clients = await getClientsWithSubscription();

  return clients.filter((client) => {
    if (!client.daysUntilExpiration) return false;
    return (
      client.daysUntilExpiration >= 0 &&
      client.daysUntilExpiration <= daysThreshold
    );
  });
};

export const getOverdueClients = async (): Promise<ClientWithSubscription[]> => {
  const clients = await getClientsWithSubscription();

  return clients.filter((client) => {
    if (!client.daysUntilExpiration) return false;
    return client.daysUntilExpiration < 0;
  });
};

export const getInactiveClients = async (): Promise<ClientWithSubscription[]> => {
  const clients = await getClientsWithSubscription();
  return clients.filter((client) => !client.isActive);
};