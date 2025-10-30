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
// 🔥 IMPORT SERVICIOS DE FIREBASE
import { ClientWithSubscription, getClientsWithSubscription } from '../../services/businessLogic';
import { addClient } from '../../services/clientService';

export default function NewClientScreen() {
  // Estados del formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Femenino'>('Masculino');
  
  // Estados de la UI
  const [clients, setClients] = useState<ClientWithSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // Cargar clientes cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      loadClients();
    }, [])
  );

  // 📋 CARGAR CLIENTES DESDE FIREBASE (con su info de suscripción)
  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getClientsWithSubscription();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  // Validación de teléfono (opcional pero si lo ponen debe ser válido)
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone.trim()) return true; // Si está vacío, es válido (opcional)
    const phoneRegex = /^[0-9]{7,}$/; // Mínimo 7 dígitos
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  // ➕ AGREGAR CLIENTE A FIREBASE
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

    if (phoneNumber.trim() && !validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Por favor ingresa un teléfono válido (mínimo 7 dígitos)');
      return;
    }

    try {
      setAdding(true);

      // Crear el objeto cliente (solo con los campos que tenemos en Firebase)
      const newClient = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        gender,
        isActive: true,
      };

      // Guardar en Firebase
      await addClient(newClient);
      
      Alert.alert(
        '✅ Éxito', 
        'Cliente agregado correctamente.\n\n💡 Tip: Ahora puedes asignarle un plan de membresía desde la lista de clientes.'
      );

      // Limpiar formulario
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setGender('Masculino');

      // Recargar lista
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
                    {c.currentPlan && (
                      <Text style={styles.clientDetail}>
                        🏋️ {c.currentPlan.planName} - ${c.currentPlan.price}
                      </Text>
                    )}
                  </View>

                  {/* Mostrar estado de vencimiento si tiene suscripción */}
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

                  {/* Si no tiene suscripción */}
                  {!c.subscription && (
                    <View style={[styles.expirationBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.expirationText, { color: '#92400E' }]}>
                        ⚠️ Sin plan asignado
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