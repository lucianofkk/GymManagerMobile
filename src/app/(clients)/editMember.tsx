// src/app/(clients)/editMember.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getClientById, updateClient } from '../../services/clientService';
import { styles } from '../../styles/editMemberStyles';
import { Client } from '../../types/type';

// ═══════════════════════════════════════════════════════════════════════════
// PANTALLA DE EDICIÓN DE CLIENTE
// Permite editar nombre, apellido, teléfono y género del cliente
// ═══════════════════════════════════════════════════════════════════════════
export default function EditMemberScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams<{ clientId: string }>();

  // ═══════════════════════════════════════════════════════════════════════
  // ESTADO DEL FORMULARIO
  // ═══════════════════════════════════════════════════════════════════════
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [isActive, setIsActive] = useState(true); // Estado del cliente

  // ═══════════════════════════════════════════════════════════════════════
  // ESTADO DE CARGA Y EDICIÓN
  // ═══════════════════════════════════════════════════════════════════════
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════
  // CARGAR DATOS DEL CLIENTE AL MONTAR
  // Se ejecuta cuando el componente se monta o cuando clientId cambia
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    loadClientData();
  }, [clientId]);

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Cargar datos del cliente desde la base de datos
  // ═══════════════════════════════════════════════════════════════════════
  const loadClientData = async () => {
    if (!clientId) {
      Alert.alert('Error', 'ID de cliente no válido');
      router.back();
      return;
    }

    try {
      setLoading(true);
      const client = await getClientById(clientId);

      if (!client) {
        Alert.alert('Error', 'Cliente no encontrado');
        router.back();
        return;
      }

      // Establecer los datos del cliente en el formulario
      setFirstName(client.firstName);
      setLastName(client.lastName);
      setPhoneNumber(client.phoneNumber || '');
      setGender(client.gender);
      setIsActive(client.isActive); // Cargar estado
    } catch (error) {
      console.error('❌ Error loading client:', error);
      Alert.alert('Error', 'No se pudo cargar los datos del cliente');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Detectar cambios en el formulario
  // Se llama cada vez que el usuario modifica un campo
  // ═══════════════════════════════════════════════════════════════════════
  const trackChanges = () => {
    setHasChanges(true);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Validar teléfono
  // Requiere mínimo 7 dígitos numéricos
  // ═══════════════════════════════════════════════════════════════════════
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{7,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Guardar cambios del cliente
  // Valida, actualiza en BD y vuelve a la pantalla anterior
  // ═══════════════════════════════════════════════════════════════════════
  const handleSaveChanges = async () => {
    // Validar nombre
    if (!firstName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre');
      return;
    }

    // Validar apellido
    if (!lastName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el apellido');
      return;
    }

    // Validar teléfono (opcional pero debe ser válido si se ingresa)
    if (phoneNumber.trim() && !validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Por favor ingresa un teléfono válido (mínimo 7 dígitos)');
      return;
    }

    try {
      setSaving(true);

      // Objeto con los datos actualizados
      const updatedData: Partial<Client> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        phoneNumber: phoneNumber.trim() || undefined,
        isActive, // Incluir estado
      };

      // Llamar servicio para actualizar en Firebase
      await updateClient(clientId, updatedData);

      console.log('✅ Cliente actualizado correctamente');
      Alert.alert('Éxito', 'Los datos se actualizaron correctamente');
      setHasChanges(false);
      
      // Volver a la pantalla anterior
      router.back();
    } catch (error) {
      console.error('❌ Error updating client:', error);
      Alert.alert('Error', 'No se pudo guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDERIZADO: Pantalla de carga
  // ═══════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RENDERIZADO: Formulario principal
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER: Botón atrás y título */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Editar Cliente</Text>
          <View style={{ width: 60 }} />
        </View>

        <Text style={styles.subtitle}>Modifica los datos del cliente</Text>

        {/* CAMPO: Nombre */}
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            trackChanges();
          }}
          editable={!saving}
          placeholderTextColor="#9CA3AF"
        />

        {/* CAMPO: Apellido */}
        <Text style={styles.label}>Apellido *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pérez"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            trackChanges();
          }}
          editable={!saving}
          placeholderTextColor="#9CA3AF"
        />

        {/* CAMPO: Teléfono */}
        <Text style={styles.label}>Teléfono (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3644123456"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            trackChanges();
          }}
          editable={!saving}
          keyboardType="phone-pad"
          placeholderTextColor="#9CA3AF"
        />





        {/* CAMPO: Género */}
        <Text style={styles.label}>Género *</Text>
        <View style={styles.genderContainer}>
          {(['Masculino', 'Femenino'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genderButton,
                gender === g && styles.genderButtonActive,
              ]}
              onPress={() => {
                setGender(g);
                trackChanges();
              }}
              disabled={saving}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === g && styles.genderTextActive,
                ]}
              >
                {g === 'Masculino' ? '👨 ' : '👩 '}
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* BOTÓN: Dar de baja / Reactivar cliente */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {isActive ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={() => {
              setIsActive(false);
              trackChanges();
            }}
            disabled={saving}
          >
            <Text style={styles.actionButtonText}> Dar de Baja</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.successButton]}
            onPress={() => {
              setIsActive(true);
              trackChanges();
            }}
            disabled={saving}
          >
            <Text style={styles.actionButtonText}>Reactivar</Text>
          </TouchableOpacity>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* BOTONES DE ACCIÓN: Guardar y Cancelar */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <View style={styles.buttonsContainer}>
          {/* Botón: Guardar cambios */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!hasChanges || saving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSaveChanges}
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <>
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Guardando...</Text>
              </>
            ) : (
              <Text style={styles.saveButtonText}>💾 Guardar Cambios</Text>
            )}
          </TouchableOpacity>

          {/* Botón: Cancelar */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* ALERTA: Cambios sin guardar */}
        {hasChanges && (
          <View style={styles.changesAlert}>
            <Text style={styles.changesAlertText}>
              ⚠️ Tienes cambios sin guardar
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}