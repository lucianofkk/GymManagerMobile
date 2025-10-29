// src/services/membershipPlansService.ts
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
import { db } from './firebaseConfig';

    export interface MembershipPlan {
    id?: string;
    planName: string;
    duration: number; // Días de duración del plan
    price: number;
    description: string;
    isActive: boolean;
}

const plansCollection = collection(db, 'membershipPlans');

// 🟢 Crear plan
export const addMembershipPlan = async (plan: Omit<MembershipPlan, 'id'>) => {
const docRef = await addDoc(plansCollection, {
    ...plan,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
});
    return docRef.id;
};

// 🔵 Obtener todos los planes activos (ordenados por precio)
    export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
    const q = query(
        plansCollection,
        where('isActive', '==', true),
        orderBy('price', 'asc')
);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as MembershipPlan[];
};

// 🔵 Obtener TODOS los planes (incluyendo inactivos)
    export const getAllMembershipPlans = async (): Promise<MembershipPlan[]> => {
    const snapshot = await getDocs(plansCollection);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as MembershipPlan[];
};

// 🔍 Obtener plan por ID
export const getMembershipPlanById = async (id: string): Promise<MembershipPlan | null> => {
const planRef = doc(db, 'membershipPlans', id);
const planSnap = await getDoc(planRef);
    
    if (!planSnap.exists()) {
        return null;
    }
    
    return {
        id: planSnap.id,
        ...planSnap.data(),
    } as MembershipPlan;
};

// 🟡 Actualizar plan
    export const updateMembershipPlan = async (id: string, data: Partial<MembershipPlan>) => {
    const planRef = doc(db, 'membershipPlans', id);
    await updateDoc(planRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

// 🔴 Eliminar plan (soft delete)
    export const deleteMembershipPlan = async (id: string) => {
    const planRef = doc(db, 'membershipPlans', id);
    await updateDoc(planRef, {
        isActive: false,
        updatedAt: Timestamp.now(),
    });
};

// ⚠️ Eliminar plan permanentemente
    export const permanentlyDeleteMembershipPlan = async (id: string) => {
    const planRef = doc(db, 'membershipPlans', id);
    await deleteDoc(planRef);
};