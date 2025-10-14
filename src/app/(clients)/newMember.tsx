// src/app/(clients)/newMember.tsx
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addClient, getClients } from '../../services/clientService';
import { Client } from '../../types/type';

export default function NewClientScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      const data = await getClients();
      setClients(data);
    };
    loadClients();
  }, []);

  const handleAddClient = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    const newClient: Client = {
      firstName,
      lastName,
      gender,
      phoneNumber: phoneNumber || undefined,
      isActive: true,
    };

    await addClient(newClient);
    Alert.alert('Éxito', 'Cliente agregado correctamente');

    // Limpiar formulario
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setGender('Masculino');

    // Actualizar lista
    const data = await getClients();
    setClients(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nuevo Cliente</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el nombre"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el apellido"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Número (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el número"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Género</Text>
        <View style={styles.statusContainer}>
          {['Masculino', 'Femenino'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.statusButton,
                gender === g && { backgroundColor: '#444' },
              ]}
              onPress={() => setGender(g as 'Masculino' | 'Femenino')}
            >
              <Text style={[styles.statusText, gender === g && { color: '#fff' }]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddClient}>
          <Text style={styles.addButtonText}>AGREGAR CLIENTE</Text>
        </TouchableOpacity>

        {clients.length > 0 && (
          <View style={{ marginTop: 32 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Clientes existentes:
            </Text>
            {clients.map((c) => (
              <View key={c.id} style={styles.clientCard}>
                <Text style={styles.clientText}>
                  {c.firstName} {c.lastName} - {c.gender}{c.phoneNumber ? ` - ${c.phoneNumber}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#111827' },
  label: { fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 8 },
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
  statusContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusText: { fontSize: 14, fontWeight: '600', color: '#111827' },
  addButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  addButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  clientCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  clientText: { fontSize: 16, color: '#111827' },
});
