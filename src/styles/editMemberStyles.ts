// src/styles/editMemberStyles.ts
import { StyleSheet } from 'react-native';

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS: PANTALLA DE EDICIÓN DE CLIENTE
// Paleta de colores: Azul (#1E40AF) + Blanco + Grises
// ═══════════════════════════════════════════════════════════════════════════

export const styles = StyleSheet.create({
  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Contenedor principal
  // ═════════════════════════════════════════════════════════════════════════
  container: {
    flex: 1,
    backgroundColor:'#F0F4F8', // Gris muy claro
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    paddingTop: 30, // Aumentar espacio arriba
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Header (navegación y título)
  // Diseño premium con espacio adecuado y padding
  // ═════════════════════════════════════════════════════════════════════════
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    paddingTop: 20, // Aumentar más espacio arriba
    borderBottomWidth: 2,
    borderBottomColor: '#F3F4F6',
  },

  backButton: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF', // Azul principal
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827', // Negro muy oscuro
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280', // Gris oscuro
    marginBottom: 20,
    fontWeight: '500',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Labels (etiquetas de campos)
  // ═════════════════════════════════════════════════════════════════════════
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    marginTop: 12,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Inputs de texto
  // ═════════════════════════════════════════════════════════════════════════
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB', // Gris claro
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff', // Blanco puro
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1, // Para Android
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Selector de género
  // ═════════════════════════════════════════════════════════════════════════
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },

  genderButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  genderButtonActive: {
    borderColor: '#1E40AF', // Azul principal
    backgroundColor: '#EFF6FF', // Azul muy claro
  },

  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  genderTextActive: {
    color: '#1E40AF', // Azul principal
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Botones de acción
  // ═════════════════════════════════════════════════════════════════════════
  buttonsContainer: {
    gap: 12,
    marginTop: 24,
  },

  // Botón Guardar (azul principal)
  saveButton: {
    backgroundColor: '#1E40AF', // Azul principal
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#1E40AF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4, // Para Android
  },

  saveButtonDisabled: {
    opacity: 0.5, // Transparencia para estado deshabilitado
    backgroundColor: '#9CA3AF', // Gris más oscuro
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // Botón Cancelar (gris)
  cancelButton: {
    backgroundColor: '#E5E7EB', // Gris claro
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151', // Gris oscuro
  },



  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Alerta de cambios
  // ═════════════════════════════════════════════════════════════════════════
  changesAlert: {
    backgroundColor: '#FEF3C7', // Amarillo muy claro
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B', // Amarillo oscuro
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },

  changesAlertText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E', // Marrón oscuro
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Estados de carga
  // ═════════════════════════════════════════════════════════════════════════
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },

  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // SECCIÓN: Botones de estado (Dar de baja / Reactivar)
  // ═════════════════════════════════════════════════════════════════════════
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // Distancia igual a buttonsContainer gap
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  dangerButton: {
    backgroundColor: '#EF4444', // Rojo
  },

  successButton: {
    backgroundColor: '#10B981', // Verde
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});