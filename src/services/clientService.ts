// services/clientService.ts
import { Client } from '../types/type';

// Fuporuqnciones provisionales mientras no conectes Firebase
export const addClient = async (client: Client) => {
  console.log('Agregar cliente:', client);
};

export const getClients = async (): Promise<Client[]> => {
  return []; // Devuelve vacío por ahora
};
