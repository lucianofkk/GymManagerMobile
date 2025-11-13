// src/components/RegisterPaymentModal.tsx - CON DATE PICKER NATIVO

import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getClientById } from '../services/clientService';
import { getMembershipPlanById } from '../services/membershipPlansService';
import { createPayment } from '../services/paymentService';
import { getSubscriptionById } from '../services/subscriptionsService';

interface RegisterPaymentModalProps {
  visible: boolean;
  clientId: string;
  clientName: string;
  subscriptionId: string;
  planPrice: number;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'Efectivo' | 'Transferencia';

export const RegisterPaymentModal: React.FC<RegisterPaymentModalProps> = ({
  visible,
  clientId,
  clientName,
  subscriptionId,
  planPrice,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState(planPrice.toString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [clientIsActive, setClientIsActive] = useState(true);
  const [planName, setPlanName] = useState('');

  const paymentMethods: PaymentMethod[] = ['Efectivo', 'Transferencia'];

  // 📌 Validar que el cliente esté activo al abrir el modal
  useEffect(() => {
    if (visible) {
      validateClientActive();
      loadPlanName();
    }
  }, [visible]);

  // 📌 NUEVA FUNCIÓN: Obtener nombre del plan
  const loadPlanName = async () => {
    try {
      const subscription = await getSubscriptionById(subscriptionId);
      if (subscription) {
        const plan = await getMembershipPlanById(subscription.planId);
        if (plan) {
          setPlanName(plan.planName);
        }
      }
    } catch (error) {
      console.error('Error loading plan name:', error);
    }
  };

  // 📌 NUEVA FUNCIÓN: Validar que el cliente esté activo
  const validateClientActive = async () => {
    try {
      const client = await getClientById(clientId);

      if (!client) {
        Alert.alert('Error', 'Cliente no encontrado');
        onClose();
        return;
      }

      if (!client.isActive) {
        setClientIsActive(false);
        Alert.alert(
          '❌ Cliente Inactivo',
          `No se puede registrar pagos a ${clientName} porque está dado de baja.\n\nPor favor reactiva el cliente primero.`,
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
    } catch (error) {
      console.error('Error validating client:', error);
      Alert.alert('Error', 'No se pudo validar el cliente');
      onClose();
    }
  };

  // 📌 NUEVA FUNCIÓN: Manejar cambio de fecha desde el picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // En Android, el picker se cierra automáticamente
    // En iOS, necesitamos cerrar manualmente
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setPaymentDate(selectedDate);
    }
  };

  // 💰 Registrar pago
  const handleRegisterPayment = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    if (!clientIsActive) {
      Alert.alert('Error', 'El cliente debe estar activo para registrar un pago');
      return;
    }

    try {
      setRegistering(true);

      await createPayment({
        clientId,
        subscriptionId,
        amount: amountNum,
        paymentDate,
        paymentMethod,
      });

      Alert.alert(
        '✅ Pago Registrado',
        `Se registró correctamente el pago de $${amountNum.toLocaleString('es-AR')} para ${clientName}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error registering payment:', error);
      Alert.alert('Error', 'No se pudo registrar el pago');
    } finally {
      setRegistering(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Determinar si es hoy
  const isToday = () => {
    const today = new Date();
    return paymentDate.toDateString() === today.toDateString();
  };

  return (
    <>
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
              <Text style={styles.title}>💰 Registrar Pago</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Información del cliente */}
            <View style={styles.clientInfoContainer}>
              <Text style={styles.subtitle}>Cliente: {clientName}</Text>
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

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Monto */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Monto *</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    editable={clientIsActive}
                  />
                </View>
                <Text style={styles.hint}>Precio del plan: ${planPrice.toLocaleString('es-AR')}</Text>
              </View>

              {/* Método de pago */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Método de Pago *</Text>
                <View style={styles.methodsContainer}>
                  {paymentMethods.map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.methodButton,
                        paymentMethod === method && styles.methodButtonSelected,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                      disabled={!clientIsActive}
                    >
                      <Text
                        style={[
                          styles.methodText,
                          paymentMethod === method && styles.methodTextSelected,
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 📌 NUEVA SECCIÓN: Selector de fecha con DatePicker nativo */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fecha de Pago *</Text>

                {/* Mostrar fecha seleccionada */}
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonIcon}>📅</Text>
                  <View style={styles.datePickerButtonContent}>
                    <Text style={styles.datePickerButtonDate}>
                      {formatDate(paymentDate)}
                    </Text>
                    {isToday() && (
                      <Text style={styles.datePickerButtonToday}>(Hoy)</Text>
                    )}
                  </View>
                  <Text style={styles.datePickerButtonArrow}>›</Text>
                </TouchableOpacity>

                <Text style={styles.hint}>
                  Toca para cambiar la fecha de pago
                </Text>
              </View>

              {/* Resumen */}
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>📋 Resumen del Pago</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Cliente:</Text>
                  <Text style={styles.summaryValue}>{clientName}</Text>
                </View>
                {planName && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Plan:</Text>
                    <Text style={styles.summaryValue}>{planName}</Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Monto:</Text>
                  <Text style={[styles.summaryValue, styles.summaryAmount]}>
                    ${parseFloat(amount || '0').toLocaleString('es-AR')}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Método:</Text>
                  <Text style={styles.summaryValue}>{paymentMethod}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fecha:</Text>
                  <Text style={styles.summaryValue}>
                    {formatDate(paymentDate)}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Botón registrar */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                (registering || !clientIsActive) && styles.registerButtonDisabled,
              ]}
              onPress={handleRegisterPayment}
              disabled={registering || !clientIsActive}
            >
              {registering ? (
                <>
                  <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.registerButtonText}>Registrando...</Text>
                </>
              ) : (
                <Text style={styles.registerButtonText}>REGISTRAR PAGO</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 📌 DATE PICKER NATIVO */}
      {showDatePicker && (
        <DateTimePicker
          value={paymentDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()} // No permite fechas futuras
        />
      )}

      {/* 📌 PARA iOS: Botón de confirmar fecha */}
      {showDatePicker && Platform.OS === 'ios' && (
        <View style={styles.iosDatePickerActions}>
          <TouchableOpacity
            style={styles.iosDatePickerButton}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={styles.iosDatePickerButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
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
    maxHeight: '90%',
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
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 16,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  methodsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  methodButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  methodButtonSelected: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  methodTextSelected: {
    color: '#1E40AF',
  },
  // 📌 NUEVOS ESTILOS: Date Picker Button
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  datePickerButtonIcon: {
    fontSize: 20,
  },
  datePickerButtonContent: {
    flex: 1,
  },
  datePickerButtonDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  datePickerButtonToday: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  datePickerButtonArrow: {
    fontSize: 20,
    color: '#6B7280',
  },
  summaryContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  summaryAmount: {
    fontSize: 18,
    color: '#10B981',
  },
  registerButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.5,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // 📌 ESTILOS: iOS Date Picker Actions
  iosDatePickerActions: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  iosDatePickerButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  iosDatePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});