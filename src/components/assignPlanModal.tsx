// src/components/AssignPlanModal.tsx - ARREGLADO PARA MOBILE
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getClientById } from '../services/clientService';
import type { MembershipPlan } from '../services/membershipPlansService';
import { getAllMembershipPlans } from '../services/membershipPlansService';
import { createSubscription } from '../services/subscriptionsService';

interface AssignPlanModalProps {
  visible: boolean;
  clientId: string;
  clientName: string;
  isRenewal: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignPlanModal: React.FC<AssignPlanModalProps> = ({
  visible,
  clientId,
  clientName,
  isRenewal,
  onClose,
  onSuccess,
}) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [clientIsActive, setClientIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📌 Cargar datos cuando se abre el modal
  useEffect(() => {
    if (visible) {
      setPlans([]);
      setSelectedPlan(null);
      setError(null);
      loadData();
    }
  }, [visible]);

  // 📌 NUEVA FUNCIÓN: Validar que el cliente esté activo
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Obtener datos del cliente para verificar si está activo
      const client = await getClientById(clientId);

      if (!client) {
        setError('Cliente no encontrado');
        Alert.alert('Error', 'Cliente no encontrado');
        onClose();
        return;
      }

      // 2️⃣ VALIDACIÓN: Si el cliente NO está activo, mostrar error
      if (!client.isActive) {
        setClientIsActive(false);
        setError('Cliente inactivo');
        Alert.alert(
          '❌ Cliente Inactivo',
          `No se puede asignar planes a ${clientName} porque está dado de baja.\n\nPor favor reactiva el cliente primero.`,
          [
            {
              text: 'OK',
              onPress: onClose,
            },
          ]
        );
        return;
      }

      setClientIsActive(true);

      // 3️⃣ Cargar planes solo si el cliente está activo
      const allPlans = await getAllMembershipPlans();

      const activePlans = allPlans
        .filter((plan) => plan.isActive)
        .sort((a, b) => a.price - b.price);

      setPlans(activePlans);

      if (activePlans.length === 0) {
        setError('No hay planes disponibles');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('❌ Error loading data:', errorMessage);
      setError(errorMessage);
      Alert.alert('Error', `No se pudieron cargar los datos: ${errorMessage}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // ➕ Asignar plan al cliente
  const handleAssignPlan = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Por favor selecciona un plan');
      return;
    }

    // 📌 DOBLE VALIDACIÓN: Verificar nuevamente que está activo
    if (!clientIsActive) {
      Alert.alert('Error', 'El cliente debe estar activo para asignar un plan');
      return;
    }

    try {
      setAssigning(true);

      // Crear la suscripción
      await createSubscription(clientId, selectedPlan);

      Alert.alert(
        '✅ Éxito',
        isRenewal
          ? `Plan renovado correctamente para ${clientName}`
          : `Plan asignado correctamente a ${clientName}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
            },
          },
        ]
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error assigning plan:', errorMessage);
      Alert.alert('Error', `No se pudo asignar el plan: ${errorMessage}`);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isRenewal ? '🔄 Renovar Plan' : '➕ Asignar Plan'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.clientInfoContainer}>
            <Text style={styles.subtitle}>Cliente: {clientName}</Text>
            {/* 📌 NUEVO: Indicador de estado del cliente */}
            <View
              style={[
                styles.clientStatusBadge,
                {
                  backgroundColor: clientIsActive ? '#D1FAE5' : '#FEE2E2',
                },
              ]}
            >
              <Text
                style={[
                  styles.clientStatusText,
                  {
                    color: clientIsActive ? '#065F46' : '#991B1B',
                  },
                ]}
              >
                {clientIsActive ? '✅ Activo' : '❌ Inactivo'}
              </Text>
            </View>
          </View>

          {/* ✅ ARREGLADO: Reemplazar ScrollView con View + condicionales */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1E40AF" />
              <Text style={styles.loadingText}>Cargando planes...</Text>
            </View>
          ) : clientIsActive && plans.length > 0 ? (
            // ✅ PLANES DISPONIBLES
            <ScrollView
              style={styles.plansContainer}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
            >
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.planCardSelected,
                  ]}
                  onPress={() => setSelectedPlan(plan.id!)}
                  activeOpacity={0.7}
                >
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.planName}</Text>
                    <View
                      style={[
                        styles.checkbox,
                        selectedPlan === plan.id && styles.checkboxSelected,
                      ]}
                    >
                      {selectedPlan === plan.id && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                  <View style={styles.planFooter}>
                    <Text style={styles.planPrice}>${plan.price}</Text>
                    <Text style={styles.planDuration}>{plan.duration} días</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : !clientIsActive ? (
            // ❌ CLIENTE INACTIVO
            <View style={styles.emptyContainer}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🚫</Text>
                <Text style={styles.emptyStateText}>Cliente inactivo</Text>
                <Text style={styles.emptyStateSubtext}>
                  No se puede asignar planes a un cliente dado de baja
                </Text>
              </View>
            </View>
          ) : (
            // 📋 SIN PLANES DISPONIBLES
            <View style={styles.emptyContainer}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📋</Text>
                <Text style={styles.emptyStateText}>
                  No hay planes disponibles
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Crea planes en la sección de administración
                </Text>
              </View>
            </View>
          )}

          {/* Botón asignar */}
          <TouchableOpacity
            style={[
              styles.assignButton,
              (!selectedPlan || assigning || !clientIsActive) &&
                styles.assignButtonDisabled,
            ]}
            onPress={handleAssignPlan}
            disabled={!selectedPlan || assigning || !clientIsActive}
          >
            {assigning ? (
              <>
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.assignButtonText}>Asignando...</Text>
              </>
            ) : (
              <Text style={styles.assignButtonText}>
                {isRenewal ? 'RENOVAR PLAN' : 'ASIGNAR PLAN'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
    // ✅ ARREGLADO: Asegurar que el contenedor tenga height definida
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#6B7280',
  },
  // 📌 NUEVO: Contenedor con información del cliente
  clientInfoContainer: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  // 📌 NUEVO: Badge de estado del cliente
  clientStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clientStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  plansContainer: {
    flex: 1,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
  },
  planCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  planCardSelected: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  planDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  assignButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignButtonDisabled: {
    opacity: 0.5,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});