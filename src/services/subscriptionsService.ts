// src/services/subscriptionsService.ts - VERSIÓN CORREGIDA
/**
 * 🔧 ARREGLADO:
 * - Ahora renueva la suscripción existente en lugar de crear una nueva
 * - Evita múltiples suscripciones por cliente
 * - Calcula correctamente multa y nuevas fechas
 */

import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getMembershipPlanById } from './membershipPlansService';

export interface Subscription {
    id?: string;
    clientId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    paymentStatus: 'paid' | 'pending' | 'overdue';
    lateFee: number;
}

const subscriptionsCollection = collection(db, 'subscriptions');

// ═══════════════════════════════════════════════════════════════════════════
// CREAR SUSCRIPCIÓN INICIAL (Solo se llama cuando NO hay suscripción)
// ═══════════════════════════════════════════════════════════════════════════
export const createSubscription = async (
    clientId: string,
    planId: string
): Promise<string> => {
    try {
        // ✅ PRIMERO: Validar que el cliente NO tenga una suscripción activa
        const existingSubscription = await getActiveSubscription(clientId);
        if (existingSubscription) {
            console.log(`⚠️ Cliente ${clientId} ya tiene una suscripción activa`);
            return existingSubscription.id || '';
        }

        const plan = await getMembershipPlanById(planId);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ✅ CREAR: Suscripción con estado "pending" (sin pago aún)
        const docRef = await addDoc(subscriptionsCollection, {
            clientId,
            planId,
            startDate: Timestamp.fromDate(today),
            endDate: Timestamp.fromDate(today), // ← Sin sumar días hasta que se pague
            paymentStatus: 'pending',
            lateFee: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });

        console.log(`
✅ SUSCRIPCIÓN CREADA (Pendiente de pago):
   - ID: ${docRef.id}
   - Cliente: ${clientId}
   - Plan: ${plan.planName}
   - Fecha inicio: ${today.toLocaleDateString('es-AR')}
   - Fecha vencimiento: ${today.toLocaleDateString('es-AR')} (se actualizará al pagar)
        `);

        return docRef.id;
    } catch (error) {
        console.error('❌ Error creating subscription:', error);
        throw error;
    }
};

// 🔵 Obtener todas las suscripciones
export const getSubscriptions = async (): Promise<Subscription[]> => {
    const snapshot = await getDocs(subscriptionsCollection);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            clientId: data.clientId,
            planId: data.planId,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            paymentStatus: data.paymentStatus,
            lateFee: data.lateFee || 0,
        };
    }) as Subscription[];
};

// 🔍 Obtener suscripción por ID
export const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
    const subRef = doc(db, 'subscriptions', id);
    const subSnap = await getDoc(subRef);

    if (!subSnap.exists()) {
        return null;
    }

    const data = subSnap.data();
    return {
        id: subSnap.id,
        clientId: data.clientId,
        planId: data.planId,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        paymentStatus: data.paymentStatus,
        lateFee: data.lateFee || 0,
    };
};

// 🔍 Obtener suscripciones de un cliente (TODAS)
export const getSubscriptionsByClientId = async (
    clientId: string
): Promise<Subscription[]> => {
    const q = query(subscriptionsCollection, where('clientId', '==', clientId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            clientId: data.clientId,
            planId: data.planId,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            paymentStatus: data.paymentStatus,
            lateFee: data.lateFee || 0,
        };
    }) as Subscription[];
};

// 🔍 Obtener suscripción ACTIVA (la más reciente y vigente)
export const getActiveSubscription = async (
    clientId: string
): Promise<Subscription | null> => {
    try {
        const subscriptions = await getSubscriptionsByClientId(clientId);

        // ✅ Ordenar por fecha de vencimiento descendente (la más reciente primero)
        const sorted = subscriptions.sort((a, b) => {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        });

        // ✅ Retornar la primera (la más reciente)
        return sorted[0] || null;
    } catch (error) {
        console.error('❌ Error getting active subscription:', error);
        return null;
    }
};

// 🟡 Actualizar suscripción
export const updateSubscription = async (id: string, data: any) => {
    const subDoc = doc(db, 'subscriptions', id);

    const updateData: any = { ...data };

    if (data.startDate instanceof Date) {
        updateData.startDate = Timestamp.fromDate(data.startDate);
    }
    if (data.endDate instanceof Date) {
        updateData.endDate = Timestamp.fromDate(data.endDate);
    }

    updateData.updatedAt = Timestamp.now();

    await updateDoc(subDoc, updateData);
};

// ═══════════════════════════════════════════════════════════════════════════
// 📌 FUNCIÓN CLAVE: Renovar suscripción EXISTENTE al registrar pago
// ✅ ACTUALIZA la suscripción existente (NO crea una nueva)
// ✅ Calcula multa SI está vencida
// ✅ Suma 30 días desde la fecha de pago
// ═══════════════════════════════════════════════════════════════════════════
export const renewSubscriptionOnPayment = async (
    subscriptionId: string,
    paymentDate: Date,
    planDuration: number = 30
): Promise<void> => {
    try {
        const subscription = await getSubscriptionById(subscriptionId);
        if (!subscription) {
            throw new Error('Suscripción no encontrada');
        }

        // ✅ Normalizar fechas (sin horas)
        const paymentDateNormalized = new Date(paymentDate);
        paymentDateNormalized.setHours(0, 0, 0, 0);

        const currentEndDate = new Date(subscription.endDate);
        currentEndDate.setHours(0, 0, 0, 0);

        // ✅ Determinar si estaba vencida
        const isOverdue = currentEndDate < paymentDateNormalized;

        let newEndDate: Date;
        let lateFee = 0;

        if (isOverdue) {
            // ═══════════════════════════════════════════════════════════════
            // ⚠️ CUOTA VENCIDA
            // ═══════════════════════════════════════════════════════════════
            const daysOverdue = Math.floor(
                (paymentDateNormalized.getTime() - currentEndDate.getTime()) /
                    (1000 * 60 * 60 * 24)
            );

            // ✅ Calcular multa: $500 por día
            lateFee = daysOverdue * 500;

            // ✅ Nueva fecha = fecha de pago + duración del plan
            newEndDate = new Date(paymentDateNormalized);
            newEndDate.setDate(newEndDate.getDate() + planDuration);

            console.log(`
⚠️ CUOTA VENCIDA - RENOVACIÓN:
   - Vencimiento anterior: ${currentEndDate.toLocaleDateString('es-AR')}
   - Fecha de pago: ${paymentDateNormalized.toLocaleDateString('es-AR')}
   - Días de atraso: ${daysOverdue}
   - MULTA: $${lateFee.toLocaleString('es-AR')} (${daysOverdue} días × $500)
   - Nuevo vencimiento: ${newEndDate.toLocaleDateString('es-AR')}
   - Días agregados: ${planDuration}
            `);
        } else {
            // ═══════════════════════════════════════════════════════════════
            // ✅ CUOTA VIGENTE O PRIMER PAGO
            // ═══════════════════════════════════════════════════════════════
            newEndDate = new Date(paymentDateNormalized);
            newEndDate.setDate(newEndDate.getDate() + planDuration);
            lateFee = 0;

            console.log(`
✅ CUOTA VIGENTE - RENOVACIÓN:
   - Vencimiento anterior: ${currentEndDate.toLocaleDateString('es-AR')}
   - Fecha de pago: ${paymentDateNormalized.toLocaleDateString('es-AR')}
   - Nuevo vencimiento: ${newEndDate.toLocaleDateString('es-AR')}
   - Multa: $0 (cuota vigente)
   - Días agregados: ${planDuration}
            `);
        }

        // ✅ ACTUALIZAR (no crear nueva)
        await updateSubscription(subscriptionId, {
            endDate: newEndDate,
            paymentStatus: 'paid',
            lateFee: lateFee,
        });

        console.log(`✅ Suscripción ${subscriptionId} renovada correctamente`);
    } catch (error) {
        console.error('❌ Error renovando suscripción:', error);
        throw error;
    }
};

// 📌 Desactivar todas las suscripciones de un cliente
export const deactivateClientSubscriptions = async (clientId: string) => {
    try {
        const subscriptions = await getSubscriptionsByClientId(clientId);

        await Promise.all(
            subscriptions.map((sub) =>
                updateSubscription(sub.id || '', {
                    paymentStatus: 'overdue',
                })
            )
        );

        console.log(`✅ Suscripciones del cliente ${clientId} desactivadas`);
    } catch (error) {
        console.error('❌ Error desactivando suscripciones:', error);
        throw error;
    }
};

// 🔴 Eliminar suscripción
export const deleteSubscription = async (id: string) => {
    const subDoc = doc(db, 'subscriptions', id);
    await deleteDoc(subDoc);
};