// src/components/profileModal.tsx - ACTUALIZADO
/**
 * 🔧 CAMBIOS PRINCIPALES:
 * ✅ Botón "Borrar Cliente" SOLO aparece si cliente está inactivo (isActive === false)
 * ✅ Modal de confirmación antes de eliminar permanentemente
 * ✅ Recarga lista después de borrar exitosamente
 * ✅ Manejo de errores con alertas visuales
 */

import { ClientWithSubscription } from '@/types/type';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getClientWithSubscription } from '../services/businessLogic';
import { permanentlyDeleteClient } from '../services/clientService';
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
  trash: 'delete', // ← NUEVO: Icono de basura
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
  const [isDeleting, setIsDeleting] = useState(false); // ← NUEVO
  const router = useRouter();

  useEffect(() => {
    setMember(initialMember);
  }, [initialMember]);

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Recargar datos del cliente
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
  // FUNCIÓN: Editar perfil del cliente
  // ═══════════════════════════════════════════════════════════════════════
  const handleEditProfile = () => {
    if (!member?.id) return;
    onClose();
    router.push({
      pathname: '/(clients)/editMember',
      params: { clientId: member.id },
    });
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: NUEVA - Mostrar confirmación y borrar cliente
  // ═══════════════════════════════════════════════════════════════════════
  const handleDeleteClient = () => {
    if (!member?.id) return;

    // 📌 Mostrar alerta de confirmación
    Alert.alert(
      '⚠️ Eliminar Cliente Permanentemente',
      `¿Estás seguro que deseas eliminar a ${member.firstName} ${member.lastName}? Esta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Eliminación cancelada'),
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: confirmDeleteClient,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: NUEVA - Confirmar y ejecutar borrado
  // ═══════════════════════════════════════════════════════════════════════
  const confirmDeleteClient = async () => {
    if (!member?.id) return;

    try {
      setIsDeleting(true);

      // 🗑️ Llamar servicio para borrar permanentemente
      await permanentlyDeleteClient(member.id);

      console.log(`✅ Cliente ${member.firstName} ${member.lastName} eliminado`);

      // ✅ Mostrar mensaje de éxito
      Alert.alert(
        '✅ Éxito',
        `Cliente ${member.firstName} eliminado correctamente`,
        [
          {
            text: 'OK',
            onPress: () => {
              // 🔄 Cerrar modal y recargar lista
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error eliminando cliente:', error);

      // ❌ Mostrar error
      Alert.alert(
        '❌ Error',
        'No se pudo eliminar el cliente. Intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsDeleting(false);
    }
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

                    {/* Estado de la suscripción */}
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
                {/* BOTÓN: Editar perfil (SIEMPRE visible) */}
                {/* ═══════════════════════════════════════════════════════ */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={handleEditProfile}
                  disabled={isDeleting}
                >
                  <MaterialIcon name={IconNames.edit} size={18} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* BOTONES: Acciones de suscripción */}
                {/* ═══════════════════════════════════════════════════════ */}
                <View style={styles.actionsContainer}>
                  {/* Cliente ACTIVO - Mostrar acciones normales */}
                  {member.isActive ? (
                    <>
                      {!hasSubscription && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.primaryButton]}
                          onPress={() => setShowAssignPlan(true)}
                          disabled={isDeleting}
                        >
                          <MaterialIcon name={IconNames.plus} size={18} color="white" />
                          <Text style={styles.actionButtonText}>Asignar Plan</Text>
                        </TouchableOpacity>
                      )}

                      {hasSubscription && (
                        <>
                          {member.subscription?.paymentStatus !== 'paid' && (
                            <TouchableOpacity
                              style={[styles.actionButton, styles.successButton]}
                              onPress={() => setShowRegisterPayment(true)}
                              disabled={isDeleting}
                            >
                              <MaterialIcon
                                name={IconNames.dollarSign}
                                size={18}
                                color="white"
                              />
                              <Text style={styles.actionButtonText}>Registrar Pago</Text>
                            </TouchableOpacity>
                          )}

                          {isExpired && (
                            <TouchableOpacity
                              style={[styles.actionButton, styles.warningButton]}
                              onPress={() => setShowAssignPlan(true)}
                              disabled={isDeleting}
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
                    </>
                  ) : null}
                </View>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* 📌 NUEVO: Botón BORRAR CLIENTE (Solo si está inactivo) */}
                {/* ═══════════════════════════════════════════════════════ */}
                {!member.isActive && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.dangerButton]}
                    onPress={handleDeleteClient}
                    disabled={isDeleting}
                    activeOpacity={0.7}
                  >
                    {isDeleting ? (
                      <>
                        <ActivityIndicator color="white" size="small" />
                        <Text style={styles.actionButtonText}>Eliminando...</Text>
                      </>
                    ) : (
                      <>
                        <MaterialIcon name={IconNames.trash} size={18} color="white" />
                        <Text style={styles.actionButtonText}>Borrar Cliente</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}

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