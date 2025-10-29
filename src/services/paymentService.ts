    // src/services/paymentService.ts
    import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { updateSubscription } from './subscriptionsService';

    export interface Payment {
    id?: string;
    clientId: string;
    subscriptionId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque';
    }

    const paymentsCollection = collection(db, 'payments');

// 🟢 Crear pago (y actualiza automáticamente la suscripción)
    export const createPayment = async (payment: {
    clientId: string;
    subscriptionId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque';
    }): Promise<string> => {
// Crear el pago
    const docRef = await addDoc(paymentsCollection, {
        clientId: payment.clientId,
        subscriptionId: payment.subscriptionId,
        amount: payment.amount,
        paymentDate: Timestamp.fromDate(payment.paymentDate),
        paymentMethod: payment.paymentMethod,
        createdAt: Timestamp.now(),
    });

// Actualizar el estado de la suscripción a 'paid'
    await updateSubscription(payment.subscriptionId, {
        paymentStatus: 'paid',
        lateFee: 0,
    });

    return docRef.id;
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
    
// Convertir fecha a Timestamp si viene como Date
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