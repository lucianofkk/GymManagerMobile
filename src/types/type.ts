export type MemberStatus = 'PAGADO' | 'VENCIDO' | 'POR VENCER';

export type Member = {
  id: number;
  name: string;
  number: string;
  status: MemberStatus;
  statusColor: string;
};