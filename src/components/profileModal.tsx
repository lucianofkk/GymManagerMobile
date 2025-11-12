// src/components/profileModal.tsx
import { ClientWithSubscription } from '@/types/type';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getClientWithSubscription } from '../services/businessLogic';
import { styles } from '../styles/profileModalStyles';
import { AssignPlanModal } from './assignPlanModal';
import { RegisterPaymentModal } from './registerPaymentModal';

interface ProfileModalProps {
  member: ClientWithSubscription | null; 
  isVisible: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  member: initialMember,
  isVisible,
  onClose,
}) => {
  const [member, setMember] = useState<ClientWithSubscription | null>(initialMember);
  const [showAssignPlan, setShowAssignPlan] = useState(false);
  const [showRegisterPayment, setShowRegisterPayment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Actualizar member cuando cambia initialMember
  useEffect(() => {
    setMember(initialMember);
  }, [initialMember]);

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Recargar datos del cliente desde BD
  // ═══════════════════════════════════════════════════════════════════════
  const reloadMemberData = async () => {
    if (!member?.id) return;
    
    try {
      setRefreshing(true);
      const updatedMember = await getClientWithSubscription(member.id);
      setMember(updatedMember);
    } catch (error) {
      console.error('❌ Error reloading member:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Ir a pantalla de edición
  // ═══════════════════════════════════════════════════════════════════════
  const handleEditProfile = () => {
    if (!member?.id) return;
    onClose();
    router.push({
      pathname: '/(clients)/editMember',
      params: { clientId: member.id }
    });
  };

  if (!member) return null;

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Determinar el estado de la suscripción
  // Retorna objeto con texto y colores para UI
  // ═══════════════════════════════════════════════════════════════════════
  const getPaymentStatus = () => {
    if (!member.subscription) {
      return { text: 'SIN PLAN', color: '#92400E', bgColor: '#FEF3C7' };
    }

    const days = member.daysUntilExpiration || 0;
    
    // Vencido
    if (days < 0) {
      return { text: 'VENCIDA', color: '#991B1B', bgColor: '#FEE2E2' };
    }
    
    // Por vencer (últimos 7 días)
    if (days <= 7) {
      return { text: 'POR VENCER', color: '#92400E', bgColor: '#FEF3C7' };
    }
    
    // Pagada
    if (member.subscription.paymentStatus === 'paid') {
      return { text: 'PAGADA', color: '#065F46', bgColor: '#D1FAE5' };
    }
    
    // Pendiente
    return { text: 'PENDIENTE', color: '#92400E', bgColor: '#FEF3C7' };
  };

  const paymentStatus = getPaymentStatus();
  const hasSubscription = !!member.subscription;
  const isExpired = (member.daysUntilExpiration || 0) < 0;
  const isExpiringSoon = (member.daysUntilExpiration || 0) <= 7 && (member.daysUntilExpiration || 0) >= 0;

  return (
    <>
      <Modal
        animationType="fade"
        transparent
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* HEADER: Cerrar modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalContent}>
                {/* ═══════════════════════════════════════════════════════ */}
                {/* SECCIÓN: Información del cliente */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.profileSection}>
                  <View style={styles.modalAvatarContainer}>
                    <View style={styles.modalAvatar}>
                      <Text style={styles.avatarText}>
                        {member.gender === 'Masculino' ? '👨' : '👩'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.memberInfoModal}>
                    <Text style={styles.memberNameModal}>
                      {member.firstName} {member.lastName}
                    </Text>
                    <Text style={styles.memberNumberModal}>
                      {member.phoneNumber ? `📱 ${member.phoneNumber}` : '📱 Sin teléfono'}
                    </Text>
                    
                    {/* Plan actual */}
                    {member.currentPlan ? (
                      <View style={styles.planInfoContainer}>
                        <Text style={styles.memberPlanInfo}>
                          🏋️ {member.currentPlan.planName}
                        </Text>
                        <Text style={styles.memberPlanPrice}>
                          ${member.currentPlan.price} • {member.currentPlan.duration} días
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.noPlanText}>⚠️ Sin plan asignado</Text>
                    )}

                    {/* ═══════════════════════════════════════════════════ */}
                    {/* Estado de la suscripción */}
                    {/* ═══════════════════════════════════════════════════ */}
                    <View style={styles.quotaContainerModal}>
                      <Text style={styles.quotaLabelModal}>ESTADO SUSCRIPCIÓN</Text>
                      <View
                        style={[
                          styles.statusBadgeModal,
                          { backgroundColor: paymentStatus.bgColor }
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusTextModal,
                            { color: paymentStatus.color }
                          ]}
                        >
                          {paymentStatus.text}
                        </Text>
                      </View>
                    </View>

                    {/* Días hasta vencimiento */}
                    {member.daysUntilExpiration !== undefined && member.subscription && (
                      <Text style={styles.expirationInfo}>
                        {member.daysUntilExpiration < 0
                          ? `⚠️ Vencida hace ${Math.abs(member.daysUntilExpiration)} días`
                          : member.daysUntilExpiration === 0
                          ? '🔴 Vence hoy'
                          : `📅 Vence en ${member.daysUntilExpiration} días`}
                      </Text>
                    )}
                  </View>
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* BOTÓN: Editar perfil */}
                {/* ═══════════════════════════════════════════════════════ */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={handleEditProfile}
                >
                  <Text style={styles.actionButtonText}>✏️ Editar Perfil</Text>
                </TouchableOpacity>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* BOTONES: Acciones de suscripción */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.actionsContainer}>
                  {!hasSubscription && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => setShowAssignPlan(true)}
                    >
                      <Text style={styles.actionButtonText}>➕ Asignar Plan</Text>
                    </TouchableOpacity>
                  )}

                  {hasSubscription && (
                    <>
                      {member.subscription?.paymentStatus !== 'paid' && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.successButton]}
                          onPress={() => setShowRegisterPayment(true)}
                        >
                          <Text style={styles.actionButtonText}>💰 Registrar Pago</Text>
                        </TouchableOpacity>
                      )}

                      {(isExpired || isExpiringSoon) && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.warningButton]}
                          onPress={() => setShowAssignPlan(true)}
                        >
                          <Text style={styles.actionButtonText}>🔄 Renovar Plan</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* SECCIÓN: Información detallada */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>📋 Información</Text>
                  
                  {/* Estado del cliente */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estado Cliente:</Text>
                    <Text style={styles.infoValue}>
                      {member.isActive ? '✅ Activo' : '❌ Inactivo (Dado de baja)'}
                    </Text>
                  </View>
                  
                  {/* Género */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Género:</Text>
                    <Text style={styles.infoValue}>{member.gender}</Text>
                  </View>
                  
                  {/* Fechas de suscripción */}
                  {member.subscription && (
                    <>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Inicio:</Text>
                        <Text style={styles.infoValue}>
                          {new Date(member.subscription.startDate).toLocaleDateString('es-AR')}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Vencimiento:</Text>
                        <Text style={styles.infoValue}>
                          {new Date(member.subscription.endDate).toLocaleDateString('es-AR')}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para asignar/renovar plan */}
      <AssignPlanModal
        visible={showAssignPlan}
        clientId={member.id}
        clientName={`${member.firstName} ${member.lastName}`}
        isRenewal={hasSubscription}
        onClose={() => setShowAssignPlan(false)}
        onSuccess={() => {
          setShowAssignPlan(false);
          onClose();
        }}
      />

      {/* Modal para registrar pago */}
      <RegisterPaymentModal
        visible={showRegisterPayment}
        clientId={member.id}
        clientName={`${member.firstName} ${member.lastName}`}
        subscriptionId={member.subscription?.id || ''}
        planPrice={member.currentPlan?.price || 0}
        onClose={() => setShowRegisterPayment(false)}
        onSuccess={() => {
          setShowRegisterPayment(false);
          onClose();
        }}
      />
    </>
  );
};