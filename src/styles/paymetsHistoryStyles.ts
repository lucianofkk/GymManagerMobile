// src/styles/paymetsHistoryStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ═════════════════════════════════════════════════════════════════════════
  // CONTENEDOR PRINCIPAL - Fondo moderno azulado
  // ═════════════════════════════════════════════════════════════════════════
  container: {
    flex: 1,
    backgroundColor: '#e6eff9ff',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // HEADER - Gradiente azul con sombra premium
  // Título principal y contador de pagos
  // ═════════════════════════════════════════════════════════════════════════
  header: {
    backgroundColor: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000ff',
    marginBottom: 10,
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: '500',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ESTADO CARGANDO - Indicador visual con fondo suave
  // ═════════════════════════════════════════════════════════════════════════
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 40,
  },

  loadingText: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 16,
    fontWeight: '600',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CONTENIDO DE LA LISTA - Padding y espaciado mejorado
  // ═════════════════════════════════════════════════════════════════════════
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // TARJETA DE PAGO - Diseño moderno con borde superior
  // Verde para indicar pago exitoso
  // ═════════════════════════════════════════════════════════════════════════
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderTopWidth: 5,
    borderTopColor: '#10B981',
    borderLeftWidth: 5,
    borderLeftColor: 'rgba(16, 185, 129, 0.3)',
    overflow: 'hidden',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // HEADER DE TARJETA - Información del cliente y monto
  // ═════════════════════════════════════════════════════════════════════════
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  clientInfo: {
    flex: 1,
    marginRight: 12,
  },

  clientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.3,
  },

  planInfo: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  amountText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: -0.5,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // FOOTER DE TARJETA - Método de pago y fecha
  // ═════════════════════════════════════════════════════════════════════════
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#F3F4F6',
  },

  methodBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1E40AF',
  },

  methodText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
    letterSpacing: -0.2,
  },

  dateText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ESTADO VACÍO - Cuando no hay pagos registrados
  // Borde punteado y texto descriptivo
  // ═════════════════════════════════════════════════════════════════════════
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
  },

  emptyStateIcon: {
    fontSize: 72,
    marginBottom: 20,
    opacity: 0.6,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  emptyStateSubtext: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // MODAL - Overlay semi-transparente
  // ═════════════════════════════════════════════════════════════════════════
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    maxHeight: '85%',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // MODAL HEADER - Título y botón de cierre
  // Separador visual con borde inferior
  // ═════════════════════════════════════════════════════════════════════════
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#F3F4F6',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: -0.4,
  },

  closeIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeIcon: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '700',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // MODAL BODY - Información detallada del pago
  // Filas con borde izquierdo azul
  // ═════════════════════════════════════════════════════════════════════════
  modalBody: {
    marginBottom: 24,
    gap: 16,
  },

  detailRow: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },

  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },

  detailValueAmount: {
    color: '#059669',
    fontSize: 18,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // MODAL ACTIONS - Botones de acción
  // Eliminar y Cerrar con estilos diferenciados
  // ═════════════════════════════════════════════════════════════════════════
  modalActions: {
    flexDirection: 'column',
    gap: 12,
  },

  modalButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },

  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },

  deleteButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: -0.3,
  },

  closeButton: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
});