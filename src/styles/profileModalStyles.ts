// src/styles/profileModalStyles.ts
import { StyleSheet } from 'react-native';

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS: MODAL DE PERFIL DE CLIENTE
// Paleta: Azul (#1E40AF) + Blanco + Grises + Colores de estado
// ═══════════════════════════════════════════════════════════════════════════

export const styles = StyleSheet.create({
  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Overlay y contenedor modal
  // ═════════════════════════════════════════════════════════════════════════
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
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
  },

  closeButton: {
    padding: 8,
    backgroundColor: '#E5E7EB',
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
  },

  modalAvatarContainer: {
    marginRight: 16,
  },

  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
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
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },

  memberNumberModal: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },

  planInfoContainer: {
    marginBottom: 8,
  },

  memberPlanInfo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 2,
  },

  memberPlanPrice: {
    fontSize: 12,
    color: '#6B7280',
  },

  noPlanText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    marginBottom: 8,
  },

  quotaContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  quotaLabelModal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
  },

  statusBadgeModal: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  statusTextModal: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  expirationInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Botones de acción
  // ═════════════════════════════════════════════════════════════════════════
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Botón Editar (Azul principal)
  editButton: {
    backgroundColor: '#1E40AF',
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
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Información detallada
  // ═════════════════════════════════════════════════════════════════════════
  infoSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 100,
  },

  infoValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
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