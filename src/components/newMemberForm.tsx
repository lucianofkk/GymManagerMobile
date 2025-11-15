// src/components/newMember/NewMemberForm.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: 'Masculino' | 'Femenino';
}

interface NewMemberFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onGenderChange: (gender: 'Masculino' | 'Femenino') => void;
  isLoading: boolean;
}

export const NewMemberForm: React.FC<NewMemberFormProps> = ({
  formData,
  onInputChange,
  onGenderChange,
  isLoading,
}) => {
  return (
    <View>
      {/* Nombre */}
      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Juan"
        value={formData.firstName}
        onChangeText={(value) => onInputChange('firstName', value)}
        editable={!isLoading}
        placeholderTextColor="#9CA3AF"
      />

      {/* Apellido */}
      <Text style={styles.label}>Apellido *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Pérez"
        value={formData.lastName}
        onChangeText={(value) => onInputChange('lastName', value)}
        editable={!isLoading}
        placeholderTextColor="#9CA3AF"
      />

      {/* Teléfono */}
      <Text style={styles.label}>Teléfono (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 3644123456"
        value={formData.phoneNumber}
        onChangeText={(value) => onInputChange('phoneNumber', value)}
        editable={!isLoading}
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
              formData.gender === g && styles.genderButtonActive,
            ]}
            onPress={() => onGenderChange(g)}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.genderText,
                formData.gender === g && styles.genderTextActive,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});