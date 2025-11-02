// src/app/(clients)/membersList.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ProfileModal } from '../../components/profileModal';
// 🔥 IMPORTAR DESDE FIREBASE
import { ClientWithSubscription, getClientsWithSubscription } from '../../services/businessLogic';

export default function MembersListScreen() {
    const [searchText, setSearchText] = useState('');
    const [selectedMember, setSelectedMember] = useState<ClientWithSubscription | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [members, setMembers] = useState<ClientWithSubscription[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Cargar miembros cuando la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            loadMembers();
        }, [])
    );

    // 📋 CARGAR MIEMBROS DESDE FIREBASE (con suscripciones y planes)
    const loadMembers = async () => {
        try {
            setLoading(true);
            const data = await getClientsWithSubscription();
            setMembers(data);
        } catch (error) {
            console.error('Error loading members:', error);
        } finally {
            setLoading(false);
        }
    };

    // 🔄 REFRESCAR LISTA
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadMembers();
        setRefreshing(false);
    }, []);

    // 👆 ABRIR MODAL AL TOCAR UN CLIENTE
    const handleMemberPress = (member: ClientWithSubscription) => {
        setSelectedMember(member);
        setIsModalVisible(true);
    };

    // ❌ CERRAR MODAL Y RECARGAR DATOS
    const handleCloseModal = async () => {
        setIsModalVisible(false);
        setSelectedMember(null);
        // Recargar la lista completa
        await loadMembers();
    };

    // 🔍 FILTRAR CLIENTES POR BÚSQUEDA
    const filteredMembers = members.filter((m) =>
        (m.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
            m.lastName?.toLowerCase().includes(searchText.toLowerCase()))
    );

    // 🎨 OBTENER COLOR SEGÚN ESTADO DE VENCIMIENTO
    const getStatusColor = (client: ClientWithSubscription) => {
        const days = client.daysUntilExpiration || 0;
        if (days < 0) return '#EF4444'; // Rojo - Vencido
        if (days <= 7) return '#FBBF24'; // Amarillo - Por vencer
        return '#10B981'; // Verde - Vigente
    };

    // 📝 OBTENER TEXTO DE ESTADO
    const getStatusText = (client: ClientWithSubscription) => {
        const days = client.daysUntilExpiration || 0;
        if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
        if (days === 0) return 'Vence hoy';
        if (days <= 7) return `Vence en ${days} días`;
        return `Vence en ${days} días`;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mis Miembros</Text>
                <Text style={styles.headerSubtitle}>{members.length} clientes registrados</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por nombre o apellido"
                        placeholderTextColor="#9CA3AF"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {/* Members List */}
            <ScrollView
                style={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.membersWrapper}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1E40AF" />
                            <Text style={styles.loadingText}>Cargando miembros...</Text>
                        </View>
                    ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <TouchableOpacity
                                key={member.id}
                                style={[
                                    styles.memberCard,
                                    {
                                        borderLeftColor: getStatusColor(member),
                                        borderLeftWidth: 4,
                                    },
                                ]}
                                onPress={() => handleMemberPress(member)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.nameSection}>
                                        <Text style={styles.memberName}>
                                            {member.firstName} {member.lastName}
                                        </Text>
                                        <View style={styles.planBadge}>
                                            <Text style={styles.planText}>
                                                {member.currentPlan?.planName || 'Sin plan'}
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
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoIcon}>👤</Text>
                                        <Text style={styles.infoText}>{member.gender}</Text>
                                    </View>
                                    {member.currentPlan && (
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoIcon}>💰</Text>
                                            <Text style={styles.infoText}>
                                                ${member.currentPlan.price}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Badge de vencimiento */}
                                {member.daysUntilExpiration !== undefined ? (
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
                                ) : (
                                    <View style={[styles.expirationBadge, { backgroundColor: '#FEF3C7' }]}>
                                        <Text style={[styles.expirationText, { color: '#92400E' }]}>
                                            ⚠️ Sin suscripción activa
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateIcon}>👥</Text>
                            <Text style={styles.emptyStateText}>
                                {members.length === 0
                                    ? 'No hay miembros registrados'
                                    : 'No se encontraron resultados'}
                            </Text>
                            <Text style={styles.emptyStateSubtext}>
                                {members.length === 0
                                    ? 'Agrega tu primer cliente para comenzar'
                                    : 'Intenta con otro término de búsqueda'}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modal de perfil */}
            <ProfileModal
                member={selectedMember}
                isVisible={isModalVisible}
                onClose={handleCloseModal}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    searchContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 8,
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        paddingVertical: 12,
    },
    listContainer: {
        flex: 1,
    },
    membersWrapper: {
        padding: 16,
        gap: 12,
    },
    memberCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 12,
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
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
    },
    loadingText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
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