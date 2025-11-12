// src/styles/plansScreenStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ═══════════════════════════════════════════════════════════════
  // CONTENEDOR PRINCIPAL - Gradiente visual con fondo
  // ═══════════════════════════════════════════════════════════════
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },

  // ═══════════════════════════════════════════════════════════════
  // HEADER - Diseño premium con sombra y estilo mejorado
  // ═══════════════════════════════════════════════════════════════
  header: {
    backgroundColor: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
    paddingHorizontal: 24,
    paddingTop: 45, // APARTADO PARA QUE QUEDE MAS BELLO A LA VISTA
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#1E40AF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
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

  // ═══════════════════════════════════════════════════════════════
  // SCROLL VIEW
  // ═══════════════════════════════════════════════════════════════
  scrollView: {
    flex: 1,
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTENIDO - Padding mejorado con más espacio visual
  // ═══════════════════════════════════════════════════════════════
  content: {
    padding: 20,
    paddingBottom: 100,
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTADO CARGANDO - Con animación visual
  // ═══════════════════════════════════════════════════════════════
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 16,
    fontWeight: '600',
  },

  // ═══════════════════════════════════════════════════════════════
  // TÍTULOS DE SECCIÓN - Estilo moderno con icono
  // ═══════════════════════════════════════════════════════════════
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
    marginTop: 8,
    letterSpacing: -0.3,
  },

  // ═══════════════════════════════════════════════════════════════
  // TARJETA DE PLAN - Diseño moderno con gradientes
  // Activo: Verde con efectos visuales
  // ═══════════════════════════════════════════════════════════════
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    borderTopWidth: 5,
    borderTopColor: '#10B981',
    borderLeftWidth: 5,
    borderLeftColor: 'rgba(16, 185, 129, 0.3)',
    overflow: 'hidden',
  },

  // ═══════════════════════════════════════════════════════════════
  // TARJETA DE PLAN - Inactivo
  // Efecto desvanecido con rojo
  // ═══════════════════════════════════════════════════════════════
  planCardInactive: {
    backgroundColor: '#FAFAFA',
    borderTopColor: '#EF4444',
    borderLeftColor: 'rgba(239, 68, 68, 0.3)',
    opacity: 0.75,
  },

  // ═══════════════════════════════════════════════════════════════
  // HEADER DEL PLAN
  // Layout moderno con elementos bien distribuidos
  // ═══════════════════════════════════════════════════════════════
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  planHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },

  // ═══════════════════════════════════════════════════════════════
  // NOMBRE DEL PLAN
  // Tipografía premium
  // ═══════════════════════════════════════════════════════════════
  planName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.4,
  },

  // ═══════════════════════════════════════════════════════════════
  // BADGE ACTIVO
  // Estilo moderno con gradiente implícito
  // ═══════════════════════════════════════════════════════════════
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },

  // ═══════════════════════════════════════════════════════════════
  // BADGE INACTIVO
  // Estilo rojo con énfasis
  // ═══════════════════════════════════════════════════════════════
  inactiveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  inactiveBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },

  // ═══════════════════════════════════════════════════════════════
  // PRECIO DEL PLAN
  // Destacado premium en verde degradado
  // ═══════════════════════════════════════════════════════════════
  planPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: -1,
  },

  // ═══════════════════════════════════════════════════════════════
  // DESCRIPCIÓN DEL PLAN
  // Texto con mejor jerarquía visual
  // ═══════════════════════════════════════════════════════════════
  planDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 22,
    fontWeight: '500',
  },

  // ═══════════════════════════════════════════════════════════════
  // FOOTER DEL PLAN
  // Separación visual clara con borde superior
  // ═══════════════════════════════════════════════════════════════
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1.5,
    borderTopColor: '#E5E7EB',
  },

  // ═══════════════════════════════════════════════════════════════
  // DURACIÓN DEL PLAN
  // Badge con información clara
  // ═══════════════════════════════════════════════════════════════
  planDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  planDurationLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 6,
    fontWeight: '600',
  },
  planDuration: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E40AF',
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTENEDOR DE ACCIONES
  // Flexbox para botones
  // ═══════════════════════════════════════════════════════════════
  planActions: {
    flexDirection: 'row',
    gap: 10,
  },

  // ═══════════════════════════════════════════════════════════════
  // BOTÓN EDITAR
  // Estilo moderno: borde azul con efecto hover
  // ═══════════════════════════════════════════════════════════════
  editButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    letterSpacing: -0.2,
  },

  // ═══════════════════════════════════════════════════════════════
  // BOTÓN ELIMINAR
  // Estilo destructivo con énfasis rojo
  // ═══════════════════════════════════════════════════════════════
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTADO VACÍO - Diseño atractivo
  // ═══════════════════════════════════════════════════════════════
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
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
    marginBottom: 28,
    fontWeight: '500',
  },
  emptyStateButton: {
    backgroundColor: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#1E40AF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  // ═══════════════════════════════════════════════════════════════
  // BOTÓN FLOTANTE (FAB)
  // Diseño premium con sombra mejorada
  // Posicionado fuera de zona de tab bar
  // ═══════════════════════════════════════════════════════════════
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 90,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
  },
});