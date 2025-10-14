import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors'; // importar una paleta de colores definida

// Estilos para la tarjeta de miembro en la lista
export const styles = StyleSheet.create({
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: { marginRight: 16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarText: { fontSize: 24, color: COLORS.text },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  memberNumber: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  quotaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quotaLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
});
