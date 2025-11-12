// src/app/(tabs)/paymetsHistory.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Client, getClientById } from '../../services/clientService';
import { deletePayment, getPayments } from '../../services/paymentService';
import { getSubscriptionById } from '../../services/subscriptionsService';
import { styles } from '../../styles/paymetsHistoryStyles';

// ═══════════════════════════════════════════════════════════════════════════
// PANTALLA DE HISTORIAL DE PAGOS
// Visualización de todos los pagos con integración Firebase
// ═══════════════════════════════════════════════════════════════════════════

// Tipos
interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  subscriptionId: string;
  clientName?: string;
  planName?: string;
}

const PaymentHistoryScreen: React.FC = () => {
  // ═══════════════════════════════════════════════════════════════
  // ESTADO LOCAL
  // ═══════════════════════════════════════════════════════════════
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // CARGAR PAGOS: Obtiene pagos y enriquece con datos de cliente
  // ═══════════════════════════════════════════════════════════════
  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments();

      // Enriquecer pagos con información de cliente y plan
      const detailed = await Promise.all(
        data.map(async (p: any) => {
          let clientName = 'Desconocido';
          let planName = 'N/A';

          try {
            const sub = await getSubscriptionById(p.subscriptionId);
            if (sub) {
              const client: Client | null = await getClientById(sub.clientId);
              clientName = client
                ? `${client.firstName || ''} ${client.lastName || ''}`.trim()
                : 'Sin nombre';
              planName = sub.planId ? String(sub.planId) : 'Sin plan';
            }
          } catch (err) {
            console.error('Error obteniendo cliente o suscripción:', err);
          }

          return { ...p, clientName, planName };
        })
      );

      setPayments(detailed);
    } catch (err) {
      console.error('Error al cargar pagos:', err);
      Alert.alert('Error', 'No se pudieron cargar los pagos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // LIFECYCLE: Cargar pagos al montar componente
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    loadPayments();
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // REFRESCAR: Pull-to-refresh
  // ═══════════════════════════════════════════════════════════════
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPayments();
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // FORMATEAR FECHA: Convierte a formato legible
  // ═══════════════════════════════════════════════════════════════
  const formatDate = (date: string): string => {
    try {
      return new Date(date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // FORMATEAR MONTO: Convierte a formato moneda
  // ═══════════════════════════════════════════════════════════════
  const formatAmount = (amount: number): string => {
    return `$${amount.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ═══════════════════════════════════════════════════════════════
  // ELIMINAR PAGO: Borra de Firebase con confirmación
  // ═══════════════════════════════════════════════════════════════
  const handleDeletePayment = async (payment: Payment) => {
    Alert.alert(
      'Eliminar Pago',
      `¿Estás seguro de que querés eliminar este pago de $${payment.amount}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePayment(payment.id);
              setPayments(payments.filter((p) => p.id !== payment.id));
              setSelectedPayment(null);
              Alert.alert('Listo', 'Pago eliminado correctamente');
            } catch (err) {
              console.error('Error al eliminar pago:', err);
              Alert.alert('Error', 'No se pudo eliminar el pago');
            }
          },
        },
      ]
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDERIZAR TARJETA DE PAGO
  // ═══════════════════════════════════════════════════════════════
  const renderPayment = ({ item }: { item: Payment }) => (
    <TouchableOpacity
      style={styles.paymentCard}
      onPress={() => setSelectedPayment(item)}
      activeOpacity={0.7}
    >
      {/* Header: Cliente y Monto */}
      <View style={styles.cardHeader}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.clientName}</Text>
          <Text style={styles.planInfo}>Plan: {item.planName}</Text>
        </View>
        <Text style={styles.amountText}>{formatAmount(item.amount)}</Text>
      </View>

      {/* Footer: Método y Fecha */}
      <View style={styles.cardFooter}>
        <View style={styles.methodBadge}>
          <Text style={styles.methodText}>{item.paymentMethod}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.paymentDate)}</Text>
      </View>
    </TouchableOpacity>
  );

  // ═══════════════════════════════════════════════════════════════
  // ESTADO: CARGANDO
  // ═══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Cargando pagos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PANTALLA PRINCIPAL
  // ═══════════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de Pagos</Text>
        <Text style={styles.headerSubtitle}>
          {payments.length} pagos registrados
        </Text>
      </View>

      {/* Lista de Pagos */}
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderPayment}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💳</Text>
            <Text style={styles.emptyStateText}>
              No hay pagos registrados
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Los pagos aparecerán aquí cuando se registren
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL - Detalle de pago */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Modal
        visible={!!selectedPayment}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedPayment(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Encabezado del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📄 Detalle del Pago</Text>
              <TouchableOpacity
                onPress={() => setSelectedPayment(null)}
                style={styles.closeIconButton}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Información del pago */}
            <View style={styles.modalBody}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cliente</Text>
                <Text style={styles.detailValue}>
                  {selectedPayment?.clientName || 'Sin nombre'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Monto</Text>
                <Text style={[styles.detailValue, styles.detailValueAmount]}>
                  {formatAmount(selectedPayment?.amount || 0)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Método de Pago</Text>
                <Text style={styles.detailValue}>
                  {selectedPayment?.paymentMethod || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedPayment?.paymentDate || '')}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Plan</Text>
                <Text style={styles.detailValue}>
                  {selectedPayment?.planName || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => {
                  if (selectedPayment) {
                    handleDeletePayment(selectedPayment);
                  }
                }}
              >
                <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setSelectedPayment(null)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentHistoryScreen;