// src/components/newMember/NewMemberHeader.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const NewMemberHeader = () => {
  return (
    <View>
      <Text style={styles.title}>Nuevo Cliente</Text>
      <Text style={styles.subtitle}>
        Completa los datos para registrar un nuevo cliente
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
});