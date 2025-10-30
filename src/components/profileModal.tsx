// src/components/profileModal.tsx
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ClientWithSubscription } from '../services/businessLogic';
import { styles } from '../styles/profileModalStyles';
import { AssignPlanModal } from './assignPlanModal';
import { RegisterPaymentModal } from './registerPaymentModal';

interface ProfileModalProps {
  member: ClientWithSubscription | null; 
  isVisible: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  member,
  isVisible,
  onClose,
}) => {
  const [showAssignPlan, setShowAssignPlan] = useState(false);
  const [showRegisterPayment, setShowRegisterPayment] = useState(false);

  if (!member) return null;

  // 🎨 Determinar el estado de la cuota
  const getPaymentStatus = () => {
    if (!member.subscription) {
      return { text: 'SIN PLAN', color: '#92400E', bgColor: '#FEF3C7' };
    }

    const days = member.daysUntilExpiration || 0;
    if (days < 0) {
      return { text: 'VENCIDA', color: '#991B1B', bgColor: '#FEE2E2' };
    }
    if (days <= 7) {
      return { text: 'POR VENCER', color: '#92400E', bgColor: '#FEF3C7' };
    }
    if (member.subscription.paymentStatus === 'paid') {
      return { text: 'PAGADA', color: '#065F46', bgColor: '#D1FAE5' };
    }
    return { text: 'PENDIENTE', color: '#92400E', bgColor: '#FEF3C7' };
  };

  const paymentStatus = getPaymentStatus();

  // 📝 Determinar qué botones mostrar
  const hasSubscription = !!member.subscription;
  const isExpired = (member.daysUntilExpiration || 0) < 0;
  const isExpiringSoon = (member.daysUntilExpiration || 0) <= 7 && (member.daysUntilExpiration || 0) >= 0;

  // ✅ Handler para cerrar modal hijo y refrescar
  const handleCloseChildModal = () => {
    setShowAssignPlan(false);
    setShowRegisterPayment(false);
    onClose(); // Cierra el ProfileModal y refresca la lista
  };

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
            {/* Header con botón cerrar */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalContent}>
                {/* Sección de perfil */}
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
                    
                    {/* Info del plan actual */}
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

                    {/* Estado de la cuota */}
                    <View style={styles.quotaContainerModal}>
                      <Text style={styles.quotaLabelModal}>ESTADO</Text>
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

                    {/* Info de vencimiento */}
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

                {/* Botones de acción */}
                <View style={styles.actionsContainer}>
                  {/* Si NO tiene suscripción */}
                  {!hasSubscription && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => setShowAssignPlan(true)}
                    >
                      <Text style={styles.actionButtonText}>➕ Asignar Plan</Text>
                    </TouchableOpacity>
                  )}

                  {/* Si tiene suscripción */}
                  {hasSubscription && (
                    <>
                      {/* Botón Registrar Pago */}
                      {member.subscription?.paymentStatus !== 'paid' && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.successButton]}
                          onPress={() => setShowRegisterPayment(true)}
                        >
                          <Text style={styles.actionButtonText}>💰 Registrar Pago</Text>
                        </TouchableOpacity>
                      )}

                      {/* Botón Renovar Plan (si está vencido o por vencer) */}
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

                {/* Info adicional */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>📋 Información</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Género:</Text>
                    <Text style={styles.infoValue}>{member.gender}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estado:</Text>
                    <Text style={styles.infoValue}>
                      {member.isActive ? '✅ Activo' : '❌ Inactivo'}
                    </Text>
                  </View>
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
        onSuccess={handleCloseChildModal}
      />

      {/* Modal para registrar pago */}
      <RegisterPaymentModal
        visible={showRegisterPayment}
        clientId={member.id}
        clientName={`${member.firstName} ${member.lastName}`}
        subscriptionId={member.subscription?.id || ''}
        planPrice={member.currentPlan?.price || 0}
        onClose={() => setShowRegisterPayment(false)}
        onSuccess={handleCloseChildModal}
      />
    </>
  );
};