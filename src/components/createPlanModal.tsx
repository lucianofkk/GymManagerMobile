// src/components/CreatePlanModal.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  addMembershipPlan,
  updateMembershipPlan,
  type MembershipPlan,
} from '../services/membershipPlansService';

interface CreatePlanModalProps {
  visible: boolean;
  plan: MembershipPlan | null; // null = crear nuevo, con datos = editar
  onClose: () => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  visible,
  plan,
  onClose,
}) => {
  const [planName, setPlanName] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const isEditing = !!plan;

  // Cargar datos si es edición
  useEffect(() => {
    if (plan) {
      setPlanName(plan.planName);
      setDuration(plan.duration.toString());
      setPrice(plan.price.toString());
      setDescription(plan.description);
      setIsActive(plan.isActive);
    } else {
      // Limpiar si es nuevo
      setPlanName('');
      setDuration('30');
      setPrice('');
      setDescription('');
      setIsActive(true);
    }
  }, [plan, visible]);

  // 💾 Guardar plan
  const handleSave = async () => {
    // Validaciones
    if (!planName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del plan');
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa una duración válida');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa un precio válido');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Por favor ingresa una descripción');
      return;
    }

    try {
      setSaving(true);

      const planData = {
        planName: planName.trim(),
        duration: durationNum,
        price: priceNum,
        description: description.trim(),
        isActive,
      };

      if (isEditing && plan?.id) {
        // Actualizar plan existente
        await updateMembershipPlan(plan.id, planData);
        Alert.alert('✅ Éxito', 'Plan actualizado correctamente');
      } else {
        // Crear nuevo plan
        await addMembershipPlan(planData);
        Alert.alert('✅ Éxito', 'Plan creado correctamente');
      }

      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
      Alert.alert('Error', 'No se pudo guardar el plan');
    } finally {
      setSaving(false);
    }
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
            <Text style={styles.title}>
              {isEditing ? '✏️ Editar Plan' : '➕ Crear Plan'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Nombre del plan */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre del Plan *</Text>
              <TextInput
                style={styles.input}
                value={planName}
                onChangeText={setPlanName}
                placeholder="Ej: Basic, Standard, Premium"
                placeholderTextColor="#9CA3AF"
                editable={!saving}
              />
            </View>

            {/* Duración */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Duración (días) *</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="30"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                editable={!saving}
              />
              <Text style={styles.hint}>
                Días de validez del plan desde la fecha de inicio
              </Text>
            </View>

            {/* Precio */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Precio *</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  editable={!saving}
                />
              </View>
            </View>

            {/* Descripción */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripción *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Ej: Acceso completo al gimnasio y clases grupales"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                editable={!saving}
              />
            </View>

            {/* Estado Activo/Inactivo */}
            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.label}>Plan Activo</Text>
                <Text style={styles.hint}>
                  Solo los planes activos se muestran al asignar
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                disabled={saving}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor={isActive ? '#fff' : '#f4f3f4'}
              />
            </View>

            {/* Preview */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>👁️ Vista Previa</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewPlanName}>
                    {planName || 'Nombre del Plan'}
                  </Text>
                  <Text style={styles.previewPrice}>
                    ${price || '0'}
                  </Text>
                </View>
                <Text style={styles.previewDescription}>
                  {description || 'Descripción del plan...'}
                </Text>
                <Text style={styles.previewDuration}>
                  ⏱️ {duration || '0'} días de duración
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Botón guardar */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Guardando...</Text>
              </>
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? 'ACTUALIZAR PLAN' : 'CREAR PLAN'}
              </Text>
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
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewPlanName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  previewPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  previewDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  previewDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});