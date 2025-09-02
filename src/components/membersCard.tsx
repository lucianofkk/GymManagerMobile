import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/memberCardStyles';
import { Member } from '../types/type';

interface MemberCardProps {
  member: Member;
  onPress: (member: Member) => void;
}

/**
 * tarjeta que muestra la información basica de un miembro.
 * al presionarla, se ejecuta 'onPress' con el objeto del miembro.
 */
export const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.memberCard}
      activeOpacity={0.7}
      onPress={() => onPress(member)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      </View>

      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberNumber}>Número: {member.number}</Text>
        <View style={styles.quotaContainer}>
          <Text style={styles.quotaLabel}>CUOTA</Text>
          <View style={[styles.statusBadge, { backgroundColor: member.statusColor }]}>
            <Text style={styles.statusText}>{member.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};