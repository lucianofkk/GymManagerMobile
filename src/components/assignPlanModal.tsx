// src/components/AssignPlanModal.tsx
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
import type { MembershipPlan } from '../services/membershipPlansService';
import { getAllMembershipPlans } from '../services/membershipPlansService';
import { createSubscription } from '../services/subscriptionsService';

interface AssignPlanModalProps {
  visible: boolean;
  clientId: string;
  clientName: string;
  isRenewal: boolean; // true si es renovación, false si es primera vez
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

  // Cargar planes cuando se abre el modal
  useEffect(() => {
    if (visible) {
      setPlans([]); // Limpiar primero
      setSelectedPlan(null);
      loadPlans();
    }
  }, [visible]);

  // 📋 Cargar planes desde Firebase
  const loadPlans = async () => {
    try {
      setLoading(true);
      console.log('🔄 Iniciando carga de planes...');
      
      // Usar getAllMembershipPlans() para evitar problemas de índice
      const allPlans = await getAllMembershipPlans();
      console.log('📦 Todos los planes recibidos:', allPlans.length);
      console.log('📦 Primer plan:', JSON.stringify(allPlans[0], null, 2));
      
      // Filtrar solo los activos y ordenar manualmente
      const activePlans = allPlans
        .filter(plan => {
          console.log(`Plan "${plan.planName}" - isActive: ${plan.isActive}, id: ${plan.id}`);
          return plan.isActive;
        })
        .sort((a, b) => a.price - b.price);
      
      console.log('📋 Planes activos cargados:', activePlans.length);
      console.log('📋 IDs de planes activos:', activePlans.map(p => p.id));
      
      setPlans(activePlans);
      console.log('✅ Estado actualizado con', activePlans.length, 'planes');
      
      if (activePlans.length === 0) {
        console.warn('⚠️ No se encontraron planes activos');
      }
    } catch (error) {
      console.error('❌ Error loading plans:', error);
      Alert.alert('Error', 'No se pudieron cargar los planes');
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
              onSuccess(); // Cierra modales y recarga
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error assigning plan:', error);
      Alert.alert('Error', 'No se pudo asignar el plan');
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

          <Text style={styles.subtitle}>Cliente: {clientName}</Text>

          {/* Lista de planes */}
          <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
            {(() => {
              console.log('🎨 Renderizando. Loading:', loading, 'Plans length:', plans.length);
              return null;
            })()}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E40AF" />
                <Text style={styles.loadingText}>Cargando planes...</Text>
              </View>
            ) : plans.length > 0 ? (
              plans.map((plan) => (
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
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No hay planes disponibles
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Crea planes en la sección de administración
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Botón asignar */}
          <TouchableOpacity
            style={[
              styles.assignButton,
              (!selectedPlan || assigning) && styles.assignButtonDisabled,
            ]}
            onPress={handleAssignPlan}
            disabled={!selectedPlan || assigning}
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
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'red'
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
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  plansContainer: {
    flex: 1,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
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