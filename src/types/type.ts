export type MemberStatus = 'PAGADO' | 'VENCIDO' | 'POR VENCER';

// Definición de la interfaz Client
export interface Client {
  id?: string;               // ID generado por Firebase
  firstName: string;
  lastName: string;
  gender: 'Masculino' | 'Femenino';
  phoneNumber?: string | null;
  isActive: boolean;
}