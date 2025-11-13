// src/services/paymentService.ts - SIMPLIFICADO

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

// 📌 SIMPLIFICADO: Solo registra el pago
// La renovación de la suscripción la hace renewSubscriptionOnPayment()
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

        // 3️⃣ SOLO registrar el pago
        const docRef = await addDoc(paymentsCollection, {
            clientId: payment.clientId,
            subscriptionId: payment.subscriptionId,
            amount: payment.amount,
            paymentDate: Timestamp.fromDate(payment.paymentDate),
            paymentMethod: payment.paymentMethod,
            createdAt: Timestamp.now(),
        });

        // 4️⃣ LLAMAR a la función de renovación en subscriptionsService
        // Pasar la duracion del plan (normalmente 30)
        const plan = (await getMembershipPlans()).find((p) => p.id === subscription.planId);
        if (plan) {
            await renewSubscriptionOnPayment(
                payment.subscriptionId,
                payment.paymentDate,
                plan.duration
            );
        }

        console.log(`✅ Pago registrado correctamente. ID: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error creating payment:', error);
        throw error;
    }
};

// 🔵 Obtener todos los pagos (ordenados por fecha descendente)
export const getPayments = async (): Promise<Payment[]> => {
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
};

// ⭐ Obtener pagos enriquecidos CON CACHEO
export const getPaymentsWithDetails = async (): Promise<PaymentWithDetails[]> => {
    try {
        const payments = await getPayments();

        // CACHEAR PLANES
        const plans = await getMembershipPlans();
        const plansMap = new Map(plans.map((p) => [p.id, p.planName]));

        // Enriquecer pagos
        const enrichedPayments = await Promise.all(
            payments.map(async (payment) => {
                try {
                    const subscriptionRef = doc(db, 'subscriptions', payment.subscriptionId);
                    const subscriptionSnap = await getDoc(subscriptionRef);
                    const subscriptionData = subscriptionSnap.data();

                    const client = await getClientById(payment.clientId);

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
        console.error('Error getting payments with details:', error);
        return [];
    }
};

// 🔍 Obtener pagos de un cliente específico
export const getPaymentsByClientId = async (clientId: string): Promise<Payment[]> => {
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
};

// 🔍 Obtener pagos de una suscripción específica
export const getPaymentsBySubscriptionId = async (
    subscriptionId: string
): Promise<Payment[]> => {
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
};

// 🟡 Actualizar pago
export const updatePayment = async (id: string, data: any) => {
    const payDoc = doc(db, 'payments', id);

    const updateData: any = { ...data };

    if (data.paymentDate instanceof Date) {
        updateData.paymentDate = Timestamp.fromDate(data.paymentDate);
    }

    updateData.updatedAt = Timestamp.now();

    await updateDoc(payDoc, updateData);
};

// 🔴 Eliminar pago
export const deletePayment = async (id: string) => {
    const payDoc = doc(db, 'payments', id);
    await deleteDoc(payDoc);
};

// 📊 Obtener ingresos del mes actual
export const getMonthlyIncome = async (): Promise<number> => {
    const payments = await getPayments();
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthlyPayments = payments.filter((p) => {
        const payDate = new Date(p.paymentDate);
        return payDate >= monthStart && payDate <= today;
    });

    return monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
};

// 📊 Obtener ingresos totales
export const getTotalIncome = async (): Promise<number> => {
    const payments = await getPayments();
    return payments.reduce((sum, p) => sum + p.amount, 0);
};