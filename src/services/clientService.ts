// src/services/clientService.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Tipo del cliente
export interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // Ahora es opcional
  gender: 'Masculino' | 'Femenino';
  isActive: boolean;
}

// Colección
const clientsCollection = collection(db, "clients");

// 🟢 Crear cliente
export const addClient = async (client: Omit<Client, "id">) => {
  const docRef = await addDoc(clientsCollection, {
    ...client,
    phoneNumber: client.phoneNumber || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

// 🔵 Obtener todos los clientes (ordenados por nombre)
export const getClients = async (): Promise<Client[]> => {
  const q = query(clientsCollection, orderBy('firstName', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as DocumentData),
  })) as Client[];
};

// 🔍 Obtener cliente por ID
export const getClientById = async (id: string): Promise<Client | null> => {
  const clientRef = doc(db, "clients", id);
  const clientSnap = await getDoc(clientRef);
  
  if (!clientSnap.exists()) {
    return null;
  }
  
  return {
    id: clientSnap.id,
    ...clientSnap.data(),
  } as Client;
};

// 🔎 Buscar clientes por nombre o apellido
export const searchClients = async (searchTerm: string): Promise<Client[]> => {
  const clients = await getClients();
  const term = searchTerm.toLowerCase();
  
  return clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(term) ||
      client.lastName.toLowerCase().includes(term)
  );
};

// 🟡 Actualizar cliente
export const updateClient = async (id: string, data: Partial<Client>) => {
  const ref = doc(db, "clients", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// 🔴 Eliminar cliente (soft delete)
export const deleteClient = async (id: string) => {
  const ref = doc(db, "clients", id);
  await updateDoc(ref, {
    isActive: false,
    updatedAt: Timestamp.now(),
  });
};

// ⚠️ Eliminar cliente permanentemente
export const permanentlyDeleteClient = async (id: string) => {
  const ref = doc(db, "clients", id);
  await deleteDoc(ref);
};