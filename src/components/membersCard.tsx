import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/memberCardStyles';
import { Client } from '../types/type';

interface MemberCardProps {
    member: Client;
    onPress: (member: Client) => void;
}

/**
 * Tarjeta que muestra la información básica de un cliente.
 * Al presionarla, se ejecuta 'onPress' con el objeto del cliente.
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
                {/* Concatenamos el nombre y apellido */}
                <Text style={styles.memberName}>{member.firstName} {member.lastName}</Text>
                {/* Usamos la propiedad phoneNumber */}
                <Text style={styles.memberNumber}>Número: {member.phoneNumber}</Text>
                <View style={styles.quotaContainer}>
                    <Text style={styles.quotaLabel}>CUOTA</Text>
                    {/* El estado de la cuota basado en isActive */}
                    <View style={[styles.statusBadge, { backgroundColor: member.isActive ? '#10B981' : '#EF4444' }]}>
                        <Text style={styles.statusText}>{member.isActive ? 'ACTIVA' : 'VENCIDA'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};