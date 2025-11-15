// src/app/(clients)/newMember.tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { NewMemberForm } from '../../components/newMemberForm';
import { NewMemberHeader } from '../../components/newMemberHeader';
import { addClient } from '../../services/clientService';
interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: 'Masculino' | 'Femenino';
}

export default function NewClientScreen() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: 'Masculino',
  });

  const [adding, setAdding] = useState(false);

  // Validación de teléfono (opcional pero si lo ponen debe ser válido)
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone.trim()) return true; // Si está vacío, es válido (opcional)
    const phoneRegex = /^[0-9]{7,}$/; // Mínimo 7 dígitos
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  // ➕ AGREGAR CLIENTE A FIREBASE
  const handleAddClient = async () => {
    // Validaciones
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre');
      return;
    }

    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el apellido');
      return;
    }

    if (formData.phoneNumber.trim() && !validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('Error', 'Por favor ingresa un teléfono válido (mínimo 7 dígitos)');
      return;
    }

    try {
      setAdding(true);

      const newClient = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        gender: formData.gender,
        isActive: true,
      };

      await addClient(newClient);

      Alert.alert(
        '✅ Éxito',
        'Cliente agregado correctamente.\n\n💡 Tip: Ahora puedes asignarle un plan de membresía desde la lista de clientes.'
      );

      // Limpiar formulario
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: 'Masculino',
      });
    } catch (error) {
      console.error('Error adding client:', error);
      Alert.alert('Error', 'No se pudo agregar el cliente');
    } finally {
      setAdding(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenderChange = (gender: 'Masculino' | 'Femenino') => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NewMemberHeader />

        <NewMemberForm
          formData={formData}
          onInputChange={handleInputChange}
          onGenderChange={handleGenderChange}
          isLoading={adding}
        />

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6eff9ff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
});