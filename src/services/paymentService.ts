// src/services/paymentService.ts - VERSIÓN COMPLETA
/**
 * 🔧 FUSIÓN DE LAS DOS VERSIONES:
 * - Mantiene todas las funciones de la versión anterior
 * - Añade la lógica correcta de planDuration
 * - No pierde funcionalidad
 */

import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { getClientById } from './clientService';
import { db } from './firebaseConfig';
import { getMembershipPlans } from './membershipPlansService';
import { getSubscriptionById, renewSubscriptionOnPayment } from './subscriptionsService';

export interface Payment {
    id?: string;
    clientId: string;
    subscriptionId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque';
}

export interface PaymentWithDetails extends Payment {
    clientName: string;
    planName: string;
}

const paymentsCollection = collection(db, 'payments');

// ═══════════════════════════════════════════════════════════════════════════
// CREAR PAGO Y RENOVAR SUSCRIPCIÓN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ✅ MEJORADO: Registra el pago Y renueva la suscripción con duración correcta
 * - Valida cliente y suscripción
 * - Obtiene la duración del plan automáticamente
 * - Llama a renewSubscriptionOnPayment con la duración
 */
export const createPayment = async (payment: {
    clientId: string;
    subscriptionId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque';
}): Promise<string> => {
    try {
        // 1️⃣ Validar que el cliente exista
        const client = await getClientById(payment.clientId);
        if (!client) {
            throw new Error('Cliente no encontrado');
        }

        // 2️⃣ Validar que la suscripción exista
        const subscription = await getSubscriptionById(payment.subscriptionId);
        if (!subscription) {
            throw new Error('Suscripción no encontrada');
        }

        // 3️⃣ Registrar el pago
        const docRef = await addDoc(paymentsCollection, {
            clientId: payment.clientId,
            subscriptionId: payment.subscriptionId,
            amount: payment.amount,
            paymentDate: Timestamp.fromDate(payment.paymentDate),
            paymentMethod: payment.paymentMethod,
            createdAt: Timestamp.now(),
        });

        // 4️⃣ ✅ Obtener duración del plan y renovar suscripción
        const plans = await getMembershipPlans();
        const plan = plans.find((p) => p.id === subscription.planId);

        if (plan) {
            // ✅ Pasar la duración correcta del plan
            await renewSubscriptionOnPayment(
                payment.subscriptionId,
                payment.paymentDate,
                plan.duration // ✅ CLAVE: Usar duración real del plan
            );
        } else {
            // ⚠️ Si no encuentra el plan, usar default 30 días
            console.warn(`⚠️ Plan no encontrado para suscripción ${payment.subscriptionId}, usando default 30 días`);
            await renewSubscriptionOnPayment(
                payment.subscriptionId,
                payment.paymentDate,
                30 // Default
            );
        }

        console.log(`✅ Pago registrado correctamente. ID: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error creating payment:', error);
        throw error;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// OBTENER PAGOS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🔵 Obtener todos los pagos (ordenados por fecha descendente)
 */
export const getPayments = async (): Promise<Payment[]> => {
    try {
        const q = query(paymentsCollection, orderBy('paymentDate', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                clientId: data.clientId,
                subscriptionId: data.subscriptionId,
                amount: data.amount,
                paymentDate: data.paymentDate.toDate(),
                paymentMethod: data.paymentMethod,
            };
        }) as Payment[];
    } catch (error) {
        console.error('❌ Error fetching payments:', error);
        return [];
    }
};

/**
 * ⭐ Obtener pagos enriquecidos (con nombre de cliente y plan)
 * ✅ Usa cacheo para optimizar llamadas
 */
export const getPaymentsWithDetails = async (): Promise<PaymentWithDetails[]> => {
    try {
        const payments = await getPayments();

        // 📌 CACHEAR PLANES para no hacer N queries
        const plans = await getMembershipPlans();
        const plansMap = new Map(plans.map((p) => [p.id, p.planName]));

        // Enriquecer pagos con datos del cliente y plan
        const enrichedPayments = await Promise.all(
            payments.map(async (payment) => {
                try {
                    // Obtener datos de suscripción para acceder al planId
                    const subscriptionRef = doc(db, 'subscriptions', payment.subscriptionId);
                    const subscriptionSnap = await getDoc(subscriptionRef);
                    const subscriptionData = subscriptionSnap.data();

                    // Obtener datos del cliente
                    const client = await getClientById(payment.clientId);

                    // Buscar nombre del plan en el cacheo
                    const planName =
                        plansMap.get(subscriptionData?.planId) || 'Plan no disponible';

                    return {
                        ...payment,
                        clientName: client
                            ? `${client.firstName || ''} ${client.lastName || ''}`.trim()
                            : 'Sin nombre',
                        planName,
                    } as PaymentWithDetails;
                } catch (error) {
                    console.error(`Error enriqueciendo pago ${payment.id}:`, error);
                    return {
                        ...payment,
                        clientName: 'Error cargando',
                        planName: 'Error cargando',
                    } as PaymentWithDetails;
                }
            })
        );

        return enrichedPayments;
    } catch (error) {
        console.error('❌ Error getting payments with details:', error);
        return [];
    }
};

/**
 * 🔍 Obtener pagos de un cliente específico
 */
export const getPaymentsByClientId = async (clientId: string): Promise<Payment[]> => {
    try {
        const q = query(
            paymentsCollection,
            where('clientId', '==', clientId),
            orderBy('paymentDate', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                clientId: data.clientId,
                subscriptionId: data.subscriptionId,
                amount: data.amount,
                paymentDate: data.paymentDate.toDate(),
                paymentMethod: data.paymentMethod,
            };
        }) as Payment[];
    } catch (error) {
        console.error('❌ Error fetching payments by client:', error);
        return [];
    }
};

/**
 * 🔍 Obtener pagos de una suscripción específica
 */
export const getPaymentsBySubscriptionId = async (
    subscriptionId: string
): Promise<Payment[]> => {
    try {
        const q = query(
            paymentsCollection,
            where('subscriptionId', '==', subscriptionId),
            orderBy('paymentDate', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                clientId: data.clientId,
                subscriptionId: data.subscriptionId,
                amount: data.amount,
                paymentDate: data.paymentDate.toDate(),
                paymentMethod: data.paymentMethod,
            };
        }) as Payment[];
    } catch (error) {
        console.error('❌ Error fetching payments by subscription:', error);
        return [];
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ACTUALIZAR Y ELIMINAR PAGOS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🟡 Actualizar pago
 */
export const updatePayment = async (id: string, data: any): Promise<void> => {
    try {
        const payDoc = doc(db, 'payments', id);
        const updateData: any = { ...data };

        if (data.paymentDate instanceof Date) {
            updateData.paymentDate = Timestamp.fromDate(data.paymentDate);
        }

        updateData.updatedAt = Timestamp.now();

        await updateDoc(payDoc, updateData);
    } catch (error) {
        console.error('❌ Error updating payment:', error);
        throw error;
    }
};

/**
 * 🔴 Eliminar pago
 */
export const deletePayment = async (id: string): Promise<void> => {
    try {
        const payDoc = doc(db, 'payments', id);
        await deleteDoc(payDoc);
    } catch (error) {
        console.error('❌ Error deleting payment:', error);
        throw error;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ESTADÍSTICAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 📊 Obtener ingresos del mes actual
 */
export const getMonthlyIncome = async (): Promise<number> => {
    try {
        const payments = await getPayments();
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const monthlyPayments = payments.filter((p) => {
            const payDate = new Date(p.paymentDate);
            return payDate >= monthStart && payDate <= today;
        });

        return monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    } catch (error) {
        console.error('❌ Error calculating monthly income:', error);
        return 0;
    }
};

/**
 * 📊 Obtener ingresos totales históricos
 */
export const getTotalIncome = async (): Promise<number> => {
    try {
        const payments = await getPayments();
        return payments.reduce((sum, p) => sum + p.amount, 0);
    } catch (error) {
        console.error('❌ Error calculating total income:', error);
        return 0;
    }
};