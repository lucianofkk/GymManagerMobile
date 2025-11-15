// src/components/profileModal.tsx - ARREGLADO
/**
 * 🔧 CAMBIO CLAVE:
 * - "Renovar Plan" SOLO aparece si isExpired (< 0)
 * - NO aparece si isExpiringSoon (0-7 días)
 * - Cuando paga vigente: suma 30 días desde endDate
 * - Cuando paga vencido: suma 30 días desde paymentDate + multa
 */

import { ClientWithSubscription } from '@/types/type';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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

const IconNames = {
  close: 'close',
  user: 'account',
  phone: 'phone',
  gym: 'dumbbell',
  alert: 'alert-circle',
  calendar: 'calendar',
  edit: 'pencil',
  plus: 'plus',
  refresh: 'refresh',
  checkCircle: 'check-circle',
  dollarSign: 'cash',
  clock: 'clock-outline',
};

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  size = 24,
  color = '#1E40AF',
  style,
}) => (
  <MaterialCommunityIcons name={name as any} size={size} color={color} style={style} />
);

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

  useEffect(() => {
    setMember(initialMember);
  }, [initialMember]);

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

  const handleEditProfile = () => {
    if (!member?.id) return;
    onClose();
    router.push({
      pathname: '/(clients)/editMember',
      params: { clientId: member.id },
    });
  };

  if (!member) return null;

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Determinar el estado de la suscripción
  // ═══════════════════════════════════════════════════════════════════════
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
  const hasSubscription = !!member.subscription;
  
  // ✅ ARREGLADO: isExpired es SOLO para vencidas (< 0)
  const isExpired = (member.daysUntilExpiration || 0) < 0;
  
  // ✅ isExpiringSoon es para las que vencen pronto (0-7 días)
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
                <MaterialIcon name={IconNames.close} size={24} color="#6B7280" />
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
                      <MaterialIcon
                        name={IconNames.user}
                        size={40}
                        color="#1E40AF"
                      />
                    </View>
                  </View>

                  <View style={styles.memberInfoModal}>
                    <Text style={styles.memberNameModal}>
                      {member.firstName} {member.lastName}
                    </Text>

                    {/* Teléfono */}
                    <View style={styles.contactRow}>
                      <MaterialIcon
                        name={IconNames.phone}
                        size={16}
                        color="#6B7280"
                      />
                      <Text style={styles.contactText}>
                        {member.phoneNumber || 'Sin teléfono'}
                      </Text>
                    </View>

                    {/* Plan actual */}
                    {member.currentPlan ? (
                      <View style={styles.planInfoContainer}>
                        <View style={styles.planNameRow}>
                          <MaterialIcon
                            name={IconNames.gym}
                            size={16}
                            color="#1E40AF"
                          />
                          <Text style={styles.memberPlanInfo}>
                            {member.currentPlan.planName}
                          </Text>
                        </View>
                        <Text style={styles.memberPlanPrice}>
                          ${member.currentPlan.price} • {member.currentPlan.duration} días
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.noPlanContainer}>
                        <MaterialIcon
                          name={IconNames.alert}
                          size={16}
                          color="#92400E"
                        />
                        <Text style={styles.noPlanText}>Sin plan asignado</Text>
                      </View>
                    )}

                    {/* ═══════════════════════════════════════════════════ */}
                    {/* Estado de la suscripción */}
                    {/* ═══════════════════════════════════════════════════ */}
                    <View style={styles.quotaContainerModal}>
                      <Text style={styles.quotaLabelModal}>ESTADO SUSCRIPCIÓN</Text>
                      <View
                        style={[
                          styles.statusBadgeModal,
                          { backgroundColor: paymentStatus.bgColor },
                        ]}
                      >
                        <MaterialIcon
                          name={
                            paymentStatus.text === 'PAGADA'
                              ? IconNames.checkCircle
                              : paymentStatus.text === 'VENCIDA'
                              ? IconNames.alert
                              : IconNames.clock
                          }
                          size={14}
                          color={paymentStatus.color}
                        />
                        <Text
                          style={[
                            styles.statusTextModal,
                            { color: paymentStatus.color },
                          ]}
                        >
                          {paymentStatus.text}
                        </Text>
                      </View>
                    </View>

                    {/* Días hasta vencimiento */}
                    {member.daysUntilExpiration !== undefined && member.subscription && (
                      <View style={styles.expirationContainer}>
                        <MaterialIcon
                          name={
                            member.daysUntilExpiration < 0
                              ? IconNames.alert
                              : IconNames.calendar
                          }
                          size={16}
                          color={
                            member.daysUntilExpiration < 0 ? '#991B1B' : '#1E40AF'
                          }
                        />
                        <Text
                          style={[
                            styles.expirationInfo,
                            {
                              color:
                                member.daysUntilExpiration < 0 ? '#991B1B' : '#1E40AF',
                            },
                          ]}
                        >
                          {member.daysUntilExpiration < 0
                            ? `Vencida hace ${Math.abs(member.daysUntilExpiration)} días`
                            : member.daysUntilExpiration === 0
                            ? 'Vence hoy'
                            : `Vence en ${member.daysUntilExpiration} días`}
                        </Text>
                      </View>
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
                  <MaterialIcon name={IconNames.edit} size={18} color="#ffffffff" />
                  <Text style={styles.actionButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* BOTONES: Acciones de suscripción */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.actionsContainer}>
                  {/* 1️⃣ SIN SUSCRIPCIÓN: Mostrar "Asignar Plan" */}
                  {!hasSubscription && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => setShowAssignPlan(true)}
                    >
                      <MaterialIcon name={IconNames.plus} size={18} color="white" />
                      <Text style={styles.actionButtonText}>Asignar Plan</Text>
                    </TouchableOpacity>
                  )}

                  {/* 2️⃣ CON SUSCRIPCIÓN */}
                  {hasSubscription && (
                    <>
                      {/* 💰 Botón "Registrar Pago" - Solo si NO está pagada */}
                      {member.subscription?.paymentStatus !== 'paid' && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.successButton]}
                          onPress={() => setShowRegisterPayment(true)}
                        >
                          <MaterialIcon
                            name={IconNames.dollarSign}
                            size={18}
                            color="white"
                          />
                          <Text style={styles.actionButtonText}>Registrar Pago</Text>
                        </TouchableOpacity>
                      )}

                      {/* 🔄 Botón "Renovar Plan" - ✅ SOLO si está VENCIDA (< 0) */}
                      {isExpired && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.warningButton]}
                          onPress={() => setShowAssignPlan(true)}
                        >
                          <MaterialIcon
                            name={IconNames.refresh}
                            size={18}
                            color="white"
                          />
                          <Text style={styles.actionButtonText}>Renovar Plan</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* SECCIÓN: Información detallada */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Información</Text>

                  {/* Estado del cliente */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estado Cliente:</Text>
                    <View style={styles.infoValueContainer}>
                      <MaterialIcon
                        name={
                          member.isActive
                            ? IconNames.checkCircle
                            : IconNames.alert
                        }
                        size={16}
                        color={member.isActive ? '#10B981' : '#EF4444'}
                      />
                      <Text
                        style={[
                          styles.infoValue,
                          {
                            color: member.isActive ? '#10B981' : '#EF4444',
                          },
                        ]}
                      >
                        {member.isActive ? 'Activo' : 'Inactivo'}
                      </Text>
                    </View>
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
                        <View style={styles.infoValueContainer}>
                          <MaterialIcon
                            name={IconNames.calendar}
                            size={16}
                            color="#6B7280"
                          />
                          <Text style={styles.infoValue}>
                            {new Date(
                              member.subscription.startDate
                            ).toLocaleDateString('es-AR')}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Vencimiento:</Text>
                        <View style={styles.infoValueContainer}>
                          <MaterialIcon
                            name={IconNames.calendar}
                            size={16}
                            color="#6B7280"
                          />
                          <Text style={styles.infoValue}>
                            {new Date(member.subscription.endDate).toLocaleDateString(
                              'es-AR'
                            )}
                          </Text>
                        </View>
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
        planDuration={member.currentPlan?.duration || 30}
        currentEndDate={member.subscription?.endDate}
        onClose={() => setShowRegisterPayment(false)}
        onSuccess={() => {
          setShowRegisterPayment(false);
          onClose();
        }}
      />
    </>
  );
};