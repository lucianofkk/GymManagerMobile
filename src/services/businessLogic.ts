// src/services/businessLogic.ts
/**
 * Lógica de negocio que combina múltiples servicios
 * Maneja clientes, suscripciones, planes y estadísticas
 */

import {
  ClientWithSubscription,
  DashboardStats,
} from '../types/type';
import { getClients } from './clientService';
import { getMembershipPlanById } from './membershipPlansService';
import { getPayments } from './paymentService';
import { getSubscriptions } from './subscriptionsService';

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES: Conversión y cálculos
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convierte un timestamp de Firestore a Date de forma segura
 * Maneja diferentes formatos: Timestamp, Date, null
 */
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

/**
 * Calcula los días hasta el vencimiento
 * Retorna número positivo si falta tiempo, negativo si está vencido
 */
export const calculateDaysUntilExpiration = (endDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calcula la multa por retraso
 * $500 por cada día vencido
 */
export const calculateLateFee = (endDate: Date): number => {
  const daysOverdue = -calculateDaysUntilExpiration(endDate);
  if (daysOverdue <= 0) return 0;
  return daysOverdue * 500; // $500 por día de retraso
};

/**
 * Determina el estado de la suscripción
 * Retorna: 'paid' | 'pending' | 'overdue'
 */
const getSubscriptionStatus = (
  endDate: Date,
  paymentStatus: string
): 'paid' | 'pending' | 'overdue' => {
  const days = calculateDaysUntilExpiration(endDate);
  
  // Si está vencido, siempre es 'overdue'
  if (days < 0) {
    return 'overdue';
  }
  
  // Si está pagado, es 'paid'
  if (paymentStatus === 'paid') {
    return 'paid';
  }
  
  // Por defecto, es 'pending'
  return 'pending';
};

// ═══════════════════════════════════════════════════════════════════════════
// CLIENTES CON SUSCRIPCIÓN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene todos los clientes con su información de suscripción y plan
 * Combina datos de clientes, suscripciones y planes
 */
export const getClientsWithSubscription = async (): Promise<ClientWithSubscription[]> => {
  try {
    const clients = await getClients();
    const subscriptions = await getSubscriptions();

    const clientsWithSub = await Promise.all(
      clients.map(async (client) => {
        // Validar que el cliente tenga ID
        if (!client.id) {
          throw new Error('Cliente sin ID encontrado');
        }

        // ═══════════════════════════════════════════════════════════════
        // Buscar suscripciones del cliente y obtener la más reciente
        // ═══════════════════════════════════════════════════════════════
        const clientSubscriptions = subscriptions.filter(
          (sub) => sub.clientId === client.id
        );

        const activeSubscription = clientSubscriptions.sort((a, b) => {
          const aEnd = safeToDate(a.endDate)?.getTime() || 0;
          const bEnd = safeToDate(b.endDate)?.getTime() || 0;
          return bEnd - aEnd;
        })[0];

        // Si no tiene suscripción, retornar cliente sin plan
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

        // ═══════════════════════════════════════════════════════════════
        // Procesar suscripción y obtener datos del plan
        // ═══════════════════════════════════════════════════════════════
        const startDate = safeToDate(activeSubscription.startDate);
        const endDate = safeToDate(activeSubscription.endDate);

        if (!endDate) {
          console.warn(`⚠️ Suscripción sin endDate para cliente ${client.id}`);
        }

        const plan = await getMembershipPlanById(activeSubscription.planId);
        const daysUntilExpiration = endDate
          ? calculateDaysUntilExpiration(endDate)
          : 0;

        // Determinar el estado real de la suscripción
        const subscriptionStatus = endDate
          ? getSubscriptionStatus(endDate, activeSubscription.paymentStatus)
          : 'pending';

        return {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          phoneNumber: client.phoneNumber,
          gender: client.gender,
          isActive: client.isActive, // Estado del cliente (Activo/Inactivo)
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
            paymentStatus: subscriptionStatus, // Estado actualizado
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

/**
 * Obtiene un cliente específico con su información de suscripción
 */
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
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene las estadísticas para el dashboard
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const clients = await getClients();
    const subscriptions = await getSubscriptions();
    const payments = await getPayments();

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total de clientes activos (isActive = true)
    const activeClients = clients.filter((c) => c.isActive).length;

    // Clientes con suscripción que vence esta semana
    const expiringThisWeek = subscriptions.filter((sub) => {
      const endDate = safeToDate(sub.endDate);
      if (!endDate) return false;
      const days = calculateDaysUntilExpiration(endDate);
      return days >= 0 && days <= 7;
    }).length;

    // Ingresos del mes actual
    const monthlyIncome = payments
      .filter((p) => {
        const payDate = new Date(p.paymentDate);
        return payDate >= monthStart && payDate <= today;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    // Nuevos clientes este mes (placeholder)
    const newClientsThisMonth = 0;

    return {
      totalClients: clients.length,
      activeClients,
      expiringThisWeek,
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
// FILTROS: Clientes por estado de suscripción
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene clientes cuya suscripción está por vencer
 */
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

/**
 * Obtiene clientes con suscripción vencida
 */
export const getOverdueClients = async (): Promise<ClientWithSubscription[]> => {
  const clients = await getClientsWithSubscription();

  return clients.filter((client) => {
    if (!client.daysUntilExpiration) return false;
    return client.daysUntilExpiration < 0;
  });
};

/**
 * Obtiene clientes inactivos (isActive = false)
 */
export const getInactiveClients = async (): Promise<ClientWithSubscription[]> => {
  const clients = await getClientsWithSubscription();
  return clients.filter((client) => !client.isActive);
};