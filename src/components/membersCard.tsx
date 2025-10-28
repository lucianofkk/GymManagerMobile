// src/components/membersCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Client } from '../types/type';

interface MemberCardProps {
    member: Client;
    onPress: (member: Client) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
    const getStatusColor = (client: Client) => {
        const days = client.daysUntilExpiration || 0;
        if (days < 0) return '#EF4444';
        if (days <= 7) return '#FBBF24';
        return '#10B981';
    };

    const getStatusText = (client: Client) => {
        const days = client.daysUntilExpiration || 0;
        if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
        if (days === 0) return 'Vence hoy';
        if (days <= 7) return `Vence en ${days} días`;
        return `Vence en ${days} días`;
    };

    return (
        <TouchableOpacity
            style={[
                styles.memberCard,
                {
                    borderLeftColor: getStatusColor(member),
                    borderLeftWidth: 4,
                },
            ]}
            onPress={() => onPress(member)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.nameSection}>
                    <Text style={styles.memberName}>
                        {member.firstName} {member.lastName}
                    </Text>
                    <View style={styles.planBadge}>
                        <Text style={styles.planText}>
                            {member.plan || 'Sin plan'}
                        </Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor:
                                member.isActive ? '#D1FAE5' : '#FEE2E2',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusBadgeText,
                            {
                                color: member.isActive ? '#065F46' : '#991B1B',
                            },
                        ]}
                    >
                        {member.isActive ? 'Activo' : 'Inactivo'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                {member.phoneNumber && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📱</Text>
                        <Text style={styles.infoText}>{member.phoneNumber}</Text>
                    </View>
                )}
                {member.email && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>✉️</Text>
                        <Text style={styles.infoText}>{member.email}</Text>
                    </View>
                )}
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>👤</Text>
                    <Text style={styles.infoText}>{member.gender}</Text>
                </View>
            </View>

            {member.daysUntilExpiration !== undefined && (
                <View
                    style={[
                        styles.expirationBadge,
                        {
                            backgroundColor:
                                member.daysUntilExpiration < 0
                                    ? '#FEE2E2'
                                    : member.daysUntilExpiration <= 7
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
                                    member.daysUntilExpiration < 0
                                        ? '#991B1B'
                                        : member.daysUntilExpiration <= 7
                                        ? '#92400E'
                                        : '#065F46',
                            },
                        ]}
                    >
                        {getStatusText(member)}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    memberCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    nameSection: {
        flex: 1,
        marginRight: 12,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    planBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#1E40AF',
    },
    planText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E40AF',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        gap: 8,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        fontSize: 14,
        marginRight: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#6B7280',
    },
    expirationBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    expirationText: {
        fontSize: 12,
        fontWeight: '600',
    },
});