// src/styles/profileModalStyles.ts - ACTUALIZADO PARA LUCIDE ICONS

import { StyleSheet } from 'react-native';

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS: MODAL DE PERFIL DE CLIENTE
// Paleta: Azul (#1E40AF) + Blanco + Grises + Colores de estado
// Con soporte para Lucide Icons
// ═══════════════════════════════════════════════════════════════════════════

export const styles = StyleSheet.create({
  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Overlay y contenedor modal
  // ═════════════════════════════════════════════════════════════════════════
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Header del modal
  // ═════════════════════════════════════════════════════════════════════════
  modalHeader: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  closeButton: {
    padding: 8,
    backgroundColor: 'transparent',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Contenido scrolleable
  // ═════════════════════════════════════════════════════════════════════════
  modalContent: {
    padding: 24,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Perfil del cliente
  // ═════════════════════════════════════════════════════════════════════════
  profileSection: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  modalAvatarContainer: {
    marginRight: 16,
  },

  // 📌 ACTUALIZADO: Avatar para Lucide icons
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },

  avatarText: {
    fontSize: 28,
    color: '#111827',
  },

  memberInfoModal: {
    flex: 1,
  },

  memberNameModal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  // 📌 NUEVO: Estilos para filas con iconos
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  contactText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // 📌 NUEVO: Estilos para nombre del plan con icono
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },

  memberNumberModal: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },

  planInfoContainer: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1E40AF',
  },

  memberPlanInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },

  memberPlanPrice: {
    fontSize: 12,
    color: '#6B7280',
  },

  // 📌 NUEVO: Contenedor para sin plan
  noPlanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    gap: 8,
  },

  noPlanText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },

  quotaContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },

  quotaLabelModal: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // 📌 ACTUALIZADO: Badge de estado con soporte para iconos
  statusBadgeModal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },

  statusTextModal: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // 📌 NUEVO: Contenedor para información de expiración
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },

  expirationInfo: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Botones de acción
  // ═════════════════════════════════════════════════════════════════════════
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // Botón Editar (Azul principal)
  editButton: {
    backgroundColor: '#2e68e7ff',
    borderWidth: 1,
    borderColor: '#1E40AF',
  },

  // Botón Primario (Azul)
  primaryButton: {
    backgroundColor: '#1E40AF',
  },

  // Botón Éxito (Verde)
  successButton: {
    backgroundColor: '#10B981',
  },

  // Botón Advertencia (Amarillo/Naranja)
  warningButton: {
    backgroundColor: '#F59E0B',
  },

  // Botón Peligro (Rojo)
  dangerButton: {
    backgroundColor: '#EF4444',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Contenedor de acciones
  // ═════════════════════════════════════════════════════════════════════════
  actionsContainer: {
    gap: 12,
    marginVertical: 16,
    paddingVertical: 8,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Información detallada
  // ═════════════════════════════════════════════════════════════════════════
  infoSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 90,
  },

  // 📌 NUEVO: Contenedor para valores con iconos
  infoValueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  infoValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Estados de carga y actualización
  // ═════════════════════════════════════════════════════════════════════════
  refreshingContainer: {
    alignItems: 'center',
    padding: 16,
  },

  refreshingText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
});