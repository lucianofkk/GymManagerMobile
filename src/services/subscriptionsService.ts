// src/services/subscriptionsService.ts - MEJORADO

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

// 🟢 Crear suscripción (calcula endDate automáticamente)
export const createSubscription = async (
    clientId: string,
    planId: string
): Promise<string> => {
    const plan = await getMembershipPlanById(planId);
    if (!plan) {
        throw new Error('Plan no encontrado');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const docRef = await addDoc(subscriptionsCollection, {
        clientId,
        planId,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        paymentStatus: 'pending',
        lateFee: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });

    return docRef.id;
};

// 🟢 Crear suscripción con fechas personalizadas
export const createSubscriptionWithDates = async (subscription: {
    clientId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    paymentStatus: 'paid' | 'pending' | 'overdue';
    lateFee: number;
}): Promise<string> => {
    const docRef = await addDoc(subscriptionsCollection, {
        ...subscription,
        startDate: Timestamp.fromDate(subscription.startDate),
        endDate: Timestamp.fromDate(subscription.endDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return docRef.id;
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

// 🔍 Obtener suscripciones de un cliente
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

// 🔍 Obtener suscripción activa de un cliente
export const getActiveSubscription = async (
    clientId: string
): Promise<Subscription | null> => {
    const subscriptions = await getSubscriptionsByClientId(clientId);
    
    const activeSubscription = subscriptions.find((sub) => {
        const today = new Date();
        return sub.endDate >= today && sub.paymentStatus !== 'overdue';
    });
    
    return activeSubscription || null;
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

// NUEVA FUNCIÓN: Renovar fecha de vencimiento
// ✅ Suma los días del plan a la fecha actual (no a hoy)
export const renewSubscriptionEndDate = async (subscriptionId: string, daysToAdd: number) => {
    try {
        const subscription = await getSubscriptionById(subscriptionId);
        if (!subscription) {
            throw new Error('Suscripción no encontrada');
        }

        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + daysToAdd);

        await updateSubscription(subscriptionId, {
            endDate: newEndDate,
            paymentStatus: 'paid',
            lateFee: 0,
        });

        console.log(`✅ Suscripción ${subscriptionId} renovada hasta ${newEndDate.toLocaleDateString('es-AR')}`);
    } catch (error) {
        console.error('❌ Error renovando suscripción:', error);
        throw error;
    }
};

// 📌 NUEVA FUNCIÓN: Desactivar todas las suscripciones de un cliente
// ✅ Se llama cuando se da de baja un cliente
export const deactivateClientSubscriptions = async (clientId: string) => {
    try {
        const subscriptions = await getSubscriptionsByClientId(clientId);

        // Marcar todas las suscripciones como 'overdue'
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



// 🔄 Renovar suscripción al registrar un pago
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

        // 📌 Determinar si está vencida
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const endDate = new Date(subscription.endDate);
        endDate.setHours(0, 0, 0, 0);

        const isOverdue = endDate < today;

        let newEndDate: Date;
// Calcular nueva fecha de vencimiento
// Dependiendo si la cuota estaba vencida o no
        if (isOverdue) {
            //Cuota VENCIDA → endDate = paymentDate + 30 días
            console.log(`⚠️ Cuota vencida. Renovando desde fecha de pago: ${paymentDate.toLocaleDateString('es-AR')}`);
            newEndDate = new Date(paymentDate);
            newEndDate.setDate(newEndDate.getDate() + planDuration);
        } else {
            //Cuota NO vencida → endDate = endDate actual + 30 días
            console.log(`✅ Cuota vigente. Renovando desde endDate actual: ${endDate.toLocaleDateString('es-AR')}`);
            newEndDate = new Date(endDate);
            newEndDate.setDate(newEndDate.getDate() + planDuration);
        }

        // Actualizar la suscripción
        await updateSubscription(subscriptionId, {
            endDate: newEndDate,
            paymentStatus: 'paid',
            lateFee: 0,
        });

        console.log(`
✅ Suscripción renovada:
   - Fecha de pago: ${paymentDate.toLocaleDateString('es-AR')}
   - Nuevo vencimiento: ${newEndDate.toLocaleDateString('es-AR')}
   - Duración: ${planDuration} días
   - Estado anterior: ${isOverdue ? 'VENCIDA' : 'VIGENTE'}
        `);
    } catch (error) {
        console.error('❌ Error renovando suscripción al pagar:', error);
        throw error;
    }
};
//  Eliminar suscripción
export const deleteSubscription = async (id: string) => {
    const subDoc = doc(db, 'subscriptions', id);
    await deleteDoc(subDoc);
};

// 🔄 Renovar suscripción (crea una nueva basada en la anterior)
export const renewSubscription = async (
    clientId: string,
    planId: string
): Promise<string> => {
    return await createSubscription(clientId, planId);
};