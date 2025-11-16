// src/app/(clients)/membersList.tsx
import { ClientWithSubscription } from '@/types/type';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ProfileModal } from '../../components/profileModal';
import { getClientsWithSubscription } from '../../services/businessLogic';
import { styles } from '../../styles/membersListStlyes';

// ═══════════════════════════════════════════════════════════════════════════
// PANTALLA: LISTA DE MIEMBROS
// Muestra todos los clientes registrados con sus datos y estado de suscripción
// ═══════════════════════════════════════════════════════════════════════════
export default function MembersListScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedMember, setSelectedMember] = useState<ClientWithSubscription | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [members, setMembers] = useState<ClientWithSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════
  // CARGAR MIEMBROS CUANDO LA PANTALLA SE ENFOCA
  // ═══════════════════════════════════════════════════════════════════════
  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [])
  );

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Cargar miembros desde Firebase
  // ═══════════════════════════════════════════════════════════════════════
  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getClientsWithSubscription();
      setMembers(data);
    } catch (error) {
      console.error('❌ Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Refrescar lista
  // ═══════════════════════════════════════════════════════════════════════
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMembers();
    setRefreshing(false);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Abrir modal al tocar un cliente
  // ═══════════════════════════════════════════════════════════════════════
  const handleMemberPress = (member: ClientWithSubscription) => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Cerrar modal y recargar datos
  // ═══════════════════════════════════════════════════════════════════════
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMember(null);
    loadMembers();
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Filtrar clientes por búsqueda
  // ═══════════════════════════════════════════════════════════════════════
  const filteredMembers = members.filter((m) =>
    m.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
    m.lastName?.toLowerCase().includes(searchText.toLowerCase())
  );

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Obtener color según estado de vencimiento
  // ═══════════════════════════════════════════════════════════════════════
  const getStatusColor = (client: ClientWithSubscription) => {
    const days = client.daysUntilExpiration || 0;
    if (days < 0) return '#EF4444'; // Rojo
    if (days <= 5) return '#FBBF24'; // Amarillo
    return '#10B981'; // Verde
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIÓN: Obtener texto de estado
  // ═══════════════════════════════════════════════════════════════════════
  const getStatusText = (client: ClientWithSubscription) => {
    const days = client.daysUntilExpiration || 0;
    if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
    if (days === 0) return 'Vence hoy';
    if (days <= 7) return `Vence en ${days} días`;
    return `Vence en ${days} días`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
        <Text style={styles.backButton}>←</Text>
    </TouchableOpacity>

    <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Clientes</Text>
            <Text style={styles.headerSubtitle}>{members.length} clientes registrados</Text>
        </View>
    </View>

      {/* BUSCADOR */}
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

      {/* LISTA DE MIEMBROS */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                  { borderLeftColor: getStatusColor(member) },
                ]}
                onPress={() => handleMemberPress(member)}
                activeOpacity={0.7}
              >
                {/* HEADER DE TARJETA */}
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
                        backgroundColor: member.isActive ? '#D1FAE5' : '#FEE2E2',
                        borderColor: member.isActive ? '#10B981' : '#EF4444',
                        borderWidth: 1.5,
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

                {/* BODY DE TARJETA */}
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
                      <Text style={styles.infoIcon}>💵</Text>
                      <Text style={styles.infoText}>${member.currentPlan.price}</Text>
                    </View>
                  )}
                </View>

                {/* BADGE DE VENCIMIENTO */}
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
                        borderColor:
                          member.daysUntilExpiration < 0
                            ? '#EF4444'
                            : member.daysUntilExpiration <= 7
                            ? '#F59E0B'
                            : '#10B981',
                        borderWidth: 1.5,
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
                  <View
                    style={[
                      styles.expirationBadge,
                      {
                        backgroundColor: '#FEF3C7',
                        borderColor: '#F59E0B',
                        borderWidth: 1.5,
                      },
                    ]}
                  >
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
                {members.length === 0 ? 'No hay miembros registrados' : 'No se encontraron resultados'}
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

      {/* MODAL DE PERFIL */}
      <ProfileModal
        member={selectedMember}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}