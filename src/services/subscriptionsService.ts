    // src/services/subscriptionsService.ts
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
// Obtener el plan para conocer su duración
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
    
// Buscar la suscripción que no esté vencida
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
    
// Convertir fechas a Timestamp si vienen como Date
    if (data.startDate instanceof Date) {
        updateData.startDate = Timestamp.fromDate(data.startDate);
    }
    if (data.endDate instanceof Date) {
        updateData.endDate = Timestamp.fromDate(data.endDate);
    }
    
    updateData.updatedAt = Timestamp.now();
    
    await updateDoc(subDoc, updateData);
    };

// 🔴 Eliminar suscripción
    export const deleteSubscription = async (id: string) => {
    const subDoc = doc(db, 'subscriptions', id);
    await deleteDoc(subDoc);
    };

// 🔄 Renovar suscripción (crea una nueva basada en la anterior)
    export const renewSubscription = async (
    clientId: string,
    planId: string
    ): Promise<string> => {
// Crear nueva suscripción
    return await createSubscription(clientId, planId);
    };