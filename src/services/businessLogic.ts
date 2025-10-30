    // src/services/businessLogic.ts
    /**
     * Este archivo contiene la lógica de negocio que combina múltiples servicios
     */

    import { getClients } from './clientService';
import { getMembershipPlanById } from './membershipPlansService';
import { getPayments } from './paymentService';
import { getSubscriptions } from './subscriptionsService';

    // Convierte un timestamp de Firestore a Date de forma segura
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

    // ============================================
    // TIPOS
    // ============================================

    
    export interface ClientWithSubscription {
    id: string; // Obligatorio (siempre viene de Firebase)
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    gender: 'Masculino' | 'Femenino';
    isActive: boolean;
    // Datos calculados:
    currentPlan?: {
        id: string;
        planName: string;
        price: number;
        duration: number;
    };
    subscription?: {
        id: string;
        startDate: Date;
        endDate: Date;
        paymentStatus: 'paid' | 'pending' | 'overdue';
        lateFee: number;
    };
    daysUntilExpiration?: number;
    nextPaymentDate?: Date;
    }

    export interface DashboardStats {
    totalClients: number;
    activeClients: number;
    expiringThisWeek: number;
    monthlyIncome: number;
    newClientsThisMonth: number;
    }

    // ============================================
    // FUNCIONES UTILITARIAS
    // ============================================

    /**
     * Calcula los días hasta el vencimiento
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

    // Calcula la multa por retraso
    export const calculateLateFee = (endDate: Date): number => {
        const daysOverdue = -calculateDaysUntilExpiration(endDate);
        if (daysOverdue <= 0) return 0;
        return daysOverdue * 500; // $500 por día de retraso
    };

    // ============================================
    // CLIENTES CON SUSCRIPCIÓN
    // ============================================

    /**
     * Obtiene todos los clientes con su información de suscripción y plan
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

            // Buscar suscripción activa del cliente
            const clientSubscriptions = subscriptions.filter(
            (sub) => sub.clientId === client.id
            );

            // Obtener la suscripción más reciente
    const activeSubscription = clientSubscriptions.sort(
    (a, b) => {
        const aEnd = safeToDate(a.endDate)?.getTime() || 0;
        const bEnd = safeToDate(b.endDate)?.getTime() || 0;
        return bEnd - aEnd;
    }
    )[0];

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

    // ✅ Convertir fechas de forma segura
    const startDate = safeToDate(activeSubscription.startDate);
    const endDate = safeToDate(activeSubscription.endDate);

    if (!endDate) {
    console.warn(`Suscripción sin endDate para el cliente ${client.id}`);
    }

    const plan = await getMembershipPlanById(activeSubscription.planId);

    const daysUntilExpiration = endDate
    ? calculateDaysUntilExpiration(endDate)
    : 0;

    // Actualizar paymentStatus si está vencido
    let paymentStatus = activeSubscription.paymentStatus;
    if (endDate && daysUntilExpiration < 0 && paymentStatus !== 'paid') {
    paymentStatus = 'overdue';
    }

    return {
    id: client.id,
    firstName: client.firstName,
    lastName: client.lastName,
    phoneNumber: client.phoneNumber,
    gender: client.gender,
    isActive: client.isActive,
    currentPlan: plan
        ? {
            id: plan.id!,
            planName: plan.planName,
            price: plan.price,
            duration: plan.duration,
        }
        : undefined,
    subscription: {
        id: activeSubscription.id!,
        startDate: startDate || new Date(),
        endDate: endDate || new Date(),
        paymentStatus,
        lateFee:
        endDate && paymentStatus === 'overdue'
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
        console.error('Error fetching clients with subscriptions:', error);
        throw new Error('No se pudieron cargar los clientes');
    }
    };

    /**
     * Obtiene un cliente con su información de suscripción
     */
    export const getClientWithSubscription = async (
    clientId: string
    ): Promise<ClientWithSubscription | null> => {
    try {
        const clients = await getClientsWithSubscription();
        return clients.find((c) => c.id === clientId) || null;
    } catch (error) {
        console.error('Error fetching client with subscription:', error);
        return null;
    }
    };

    // ============================================
    // DASHBOARD STATS
    // ============================================

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

        // Total de clientes activos
        const activeClients = clients.filter((c) => c.isActive).length;

        // Clientes que vencen esta semana
        const expiringThisWeek = subscriptions.filter((sub) => {
        const days = calculateDaysUntilExpiration(sub.endDate);
        return days >= 0 && days <= 7;
        }).length;

        // Ingresos del mes
        const monthlyIncome = payments
        .filter((p) => {
            const payDate = new Date(p.paymentDate);
            return payDate >= monthStart && payDate <= today;
        })
        .reduce((sum, p) => sum + p.amount, 0);

        // Nuevos clientes este mes (placeholder - necesitarías createdAt en clients)
        const newClientsThisMonth = 0;

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

    // ============================================
    // CLIENTES POR VENCER
    // ============================================

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