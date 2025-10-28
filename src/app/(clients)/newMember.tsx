// src/app/(clients)/newMember.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addClient, getClients } from '../../services/storageService';
import { Client } from '../../types/type';

export default function NewClientScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [plan, setPlan] = useState<'Basic' | 'Standard' | 'Premium'>('Standard');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // Cargar clientes cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      loadClients();
    }, [])
  );

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{7,}$/; // Mínimo 7 dígitos
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const handleAddClient = async () => {
    // Validaciones
    if (!firstName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el apellido');
      return;
    }

    if (email.trim() && !validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    if (phoneNumber.trim() && !validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Por favor ingresa un teléfono válido (mínimo 7 dígitos)');
      return;
    }

    try {
      setAdding(true);

      const newClient: Omit<Client, 'id'> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        phoneNumber: phoneNumber.trim() || undefined,
        email: email.trim() || undefined,
        isActive: true,
        plan,
        joinDate: new Date().toISOString().split('T')[0],
        nextPaymentDate: new Date().toISOString().split('T')[0],
        daysUntilExpiration: 30,
      };

      await addClient(newClient);
      Alert.alert('Éxito', 'Cliente agregado correctamente');

      // Limpiar formulario
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setGender('Masculino');
      setPlan('Standard');

      // Actualizar lista
      await loadClients();
    } catch (error) {
      console.error('Error adding client:', error);
      Alert.alert('Error', 'No se pudo agregar el cliente');
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Nuevo Cliente</Text>
        <Text style={styles.subtitle}>Completa los datos para registrar un nuevo cliente</Text>

        {/* Nombre */}
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan"
          value={firstName}
          onChangeText={setFirstName}
          editable={!adding}
          placeholderTextColor="#9CA3AF"
        />

        {/* Apellido */}
        <Text style={styles.label}>Apellido *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pérez"
          value={lastName}
          onChangeText={setLastName}
          editable={!adding}
          placeholderTextColor="#9CA3AF"
        />

        {/* Email */}
        <Text style={styles.label}>Email (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: juan@example.com"
          value={email}
          onChangeText={setEmail}
          editable={!adding}
          keyboardType="email-address"
          placeholderTextColor="#9CA3AF"
        />

        {/* Teléfono */}
        <Text style={styles.label}>Teléfono (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3644123456"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={!adding}
          keyboardType="phone-pad"
          placeholderTextColor="#9CA3AF"
        />

        {/* Género */}
        <Text style={styles.label}>Género *</Text>
        <View style={styles.genderContainer}>
          {(['Masculino', 'Femenino'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genderButton,
                gender === g && styles.genderButtonActive,
              ]}
              onPress={() => setGender(g)}
              disabled={adding}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === g && styles.genderTextActive,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plan */}
        <Text style={styles.label}>Plan de Membresía *</Text>
        <View style={styles.planContainer}>
          {(['Basic', 'Standard', 'Premium'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.planButton,
                plan === p && styles.planButtonActive,
              ]}
              onPress={() => setPlan(p)}
              disabled={adding}
            >
              <Text
                style={[
                  styles.planText,
                  plan === p && styles.planTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón Agregar */}
        <TouchableOpacity
          style={[styles.addButton, adding && styles.addButtonDisabled]}
          onPress={handleAddClient}
          disabled={adding}
        >
          {adding ? (
            <>
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.addButtonText}>Agregando...</Text>
            </>
          ) : (
            <Text style={styles.addButtonText}>AGREGAR CLIENTE</Text>
          )}
        </TouchableOpacity>

        {/* Lista de Clientes */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E40AF" />
            <Text style={styles.loadingText}>Cargando clientes...</Text>
          </View>
        ) : clients.length > 0 ? (
          <View style={styles.clientsListContainer}>
            <Text style={styles.clientsListTitle}>
              📋 Clientes Registrados ({clients.length})
            </Text>
            <View style={styles.clientsList}>
              {clients.map((c) => (
                <View
                  key={c.id}
                  style={[
                    styles.clientCard,
                    {
                      borderLeftColor: c.isActive ? '#10B981' : '#EF4444',
                      borderLeftWidth: 4,
                    },
                  ]}
                >
                  <View style={styles.clientCardHeader}>
                    <Text style={styles.clientName}>
                      {c.firstName} {c.lastName}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: c.isActive ? '#D1FAE5' : '#FEE2E2',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: c.isActive ? '#065F46' : '#991B1B' },
                        ]}
                      >
                        {c.isActive ? 'Activo' : 'Inactivo'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.clientDetails}>
                    <Text style={styles.clientDetail}>
                      👤 {c.gender}
                    </Text>
                    {c.phoneNumber && (
                      <Text style={styles.clientDetail}>
                        📱 {c.phoneNumber}
                      </Text>
                    )}
                    {c.email && (
                      <Text style={styles.clientDetail}>
                        ✉️ {c.email}
                      </Text>
                    )}
                    <Text style={styles.clientDetail}>
                      🏋️ {c.plan || 'Sin plan'}
                    </Text>
                  </View>

                  {c.daysUntilExpiration !== undefined && (
                    <View
                      style={[
                        styles.expirationBadge,
                        {
                          backgroundColor:
                            c.daysUntilExpiration < 0
                              ? '#FEE2E2'
                              : c.daysUntilExpiration <= 7
                              ? '#FEF3C7'
                              : '#D1FAE5',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.expirationText,
                          {
                            color:
                              c.daysUntilExpiration < 0
                                ? '#991B1B'
                                : c.daysUntilExpiration <= 7
                                ? '#92400E'
                                : '#065F46',
                          },
                        ]}
                      >
                        {c.daysUntilExpiration < 0
                          ? `⚠️ Vencido hace ${Math.abs(c.daysUntilExpiration)} días`
                          : c.daysUntilExpiration === 0
                          ? '🔴 Vence hoy'
                          : `📅 Vence en ${c.daysUntilExpiration} días`}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateText}>
              No hay clientes registrados aún
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Agrega el primer cliente usando el formulario anterior
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
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
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  genderTextActive: {
    color: '#1E40AF',
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  planButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  planButtonActive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  planText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  planTextActive: {
    color: '#10B981',
  },
  addButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#1E40AF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    marginBottom: 24,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  clientsListContainer: {
    marginTop: 12,
  },
  clientsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  clientsList: {
    gap: 12,
  },
  clientCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  clientCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clientDetails: {
    gap: 6,
    marginBottom: 12,
  },
  clientDetail: {
    fontSize: 13,
    color: '#6B7280',
  },
  expirationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  expirationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
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
});