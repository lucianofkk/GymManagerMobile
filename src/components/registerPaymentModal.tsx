// src/components/RegisterPaymentModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { createPayment } from '../services/paymentService';

interface RegisterPaymentModalProps {
  visible: boolean;
  clientId: string;
  clientName: string;
  subscriptionId: string;
  planPrice: number;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque';

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
  const [registering, setRegistering] = useState(false);

  const paymentMethods: PaymentMethod[] = ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque'];

  // 💰 Registrar pago
  const handleRegisterPayment = async () => {
    // Validaciones
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    try {
      setRegistering(true);

      // Crear el pago
      await createPayment({
        clientId,
        subscriptionId,
        amount: amountNum,
        paymentDate,
        paymentMethod,
      });

      Alert.alert(
        '✅ Pago Registrado',
        `Se registró correctamente el pago de $${amountNum} para ${clientName}`,
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
            <Text style={styles.title}>💰 Registrar Pago</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Cliente: {clientName}</Text>

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
                />
              </View>
              <Text style={styles.hint}>Precio del plan: ${planPrice}</Text>
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

            {/* Fecha de pago */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de Pago</Text>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>📅 {formatDate(paymentDate)}</Text>
                <Text style={styles.dateHint}>(Hoy)</Text>
              </View>
            </View>

            {/* Resumen */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>📋 Resumen del Pago</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cliente:</Text>
                <Text style={styles.summaryValue}>{clientName}</Text>
              </View>
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
                <Text style={styles.summaryValue}>{formatDate(paymentDate)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Botón registrar */}
          <TouchableOpacity
            style={[styles.registerButton, registering && styles.registerButtonDisabled]}
            onPress={handleRegisterPayment}
            disabled={registering}
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
    marginBottom: 24,
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
    flexWrap: 'wrap',
    gap: 8,
  },
  methodButton: {
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
  },
  methodTextSelected: {
    color: '#1E40AF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginRight: 8,
  },
  dateHint: {
    fontSize: 12,
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
});