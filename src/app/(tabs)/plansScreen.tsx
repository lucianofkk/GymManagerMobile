// src/app/(tabs)/plans.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CreatePlanModal } from '../../components/createPlanModal';
import {
    getAllMembershipPlans,
    permanentlyDeleteMembershipPlan,
    type MembershipPlan
} from '../../services/membershipPlansService';
import { styles } from '../../styles/plansScreenStlye';

export default function PlansScreen() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

    // Cargar planes cuando la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            loadPlans();
        }, [])
    );

    // 📋 Cargar todos los planes (incluyendo inactivos)
    const loadPlans = async () => {
        try {
            setLoading(true);
            const data = await getAllMembershipPlans();
            setPlans(data);
        } catch (error) {
            console.error('Error loading plans:', error);
            Alert.alert('Error', 'No se pudieron cargar los planes');
        } finally {
            setLoading(false);
        }
    };

    // 🔄 Refrescar
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadPlans();
        setRefreshing(false);
    }, []);

    // ✏️ Editar plan
    const handleEdit = (plan: MembershipPlan) => {
        setEditingPlan(plan);
        setShowCreateModal(true);
    };

    // 🗑️ Eliminar plan definitivamente (solo para inactivos)
const handleDelete = async (plan: MembershipPlan) => {
    Alert.alert(
        "Eliminar plan definitivamente",
        `¿Seguro que querés eliminar el plan "${plan.planName}" para siempre?`,
        [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        // 🔹 Borrado definitivo
                        await permanentlyDeleteMembershipPlan(plan.id!);
                        Alert.alert("Listo", "El plan fue eliminado definitivamente.");
                        await loadPlans();
                    } catch (error) {
                        console.error("Error al eliminar plan:", error);
                        Alert.alert("Error", "No se pudo eliminar el plan.");
                    }
                },
            },
        ]
    );
};


    // ➕ Abrir modal para crear nuevo
    const handleCreate = () => {
        setEditingPlan(null);
        setShowCreateModal(true);
    };

    // ✅ Cerrar modal y recargar
    const handleModalClose = () => {
        setShowCreateModal(false);
        setEditingPlan(null);
        loadPlans();
    };

    // Separar planes activos e inactivos
    const activePlans = plans.filter((p) => p.isActive);
    const inactivePlans = plans.filter((p) => !p.isActive);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Planes de Membresía</Text>
                    <Text style={styles.headerSubtitle}>
                        {activePlans.length} planes activos • {inactivePlans.length} inactivos
                    </Text>
                </View>
            </View>

            {/* Lista de planes */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.content}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1E40AF" />
                            <Text style={styles.loadingText}>Cargando planes...</Text>
                        </View>
                    ) : plans.length > 0 ? (
                        <>
                            {/* Planes Activos */}
                            {activePlans.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>✅ Planes Activos</Text>
                                    {activePlans.map((plan) => (
                                        <View key={plan.id} style={styles.planCard}>
                                            <View style={styles.planHeader}>
                                                <View style={styles.planHeaderLeft}>
                                                    <Text style={styles.planName}>{plan.planName}</Text>
                                                    <View style={styles.activeBadge}>
                                                        <Text style={styles.activeBadgeText}>ACTIVO</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.planPrice}>${plan.price}</Text>
                                            </View>

                                            <Text style={styles.planDescription}>{plan.description}</Text>

                                            <View style={styles.planFooter}>
                                                <View style={styles.planDurationContainer}>
                                                    <Text style={styles.planDurationLabel}>Duración:</Text>
                                                    <Text style={styles.planDuration}>{plan.duration} días</Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={styles.editButton}
                                                    onPress={() => handleEdit(plan)}
                                                >
                                                    <Text style={styles.editButtonText}>✏️ Editar</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* Planes Inactivos */}
                            {inactivePlans.length > 0 && (
                                <>
                                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>❌ Planes Inactivos</Text>
                                    {inactivePlans.map((plan) => (
                                        <View key={plan.id} style={[styles.planCard, styles.planCardInactive]}>
                                            <View style={styles.planHeader}>
                                                <View style={styles.planHeaderLeft}>
                                                    <Text style={styles.planName}>{plan.planName}</Text>
                                                    <View style={styles.inactiveBadge}>
                                                        <Text style={styles.inactiveBadgeText}>INACTIVO</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.planPrice}>${plan.price}</Text>
                                            </View>

                                            <Text style={styles.planDescription}>{plan.description}</Text>

                                            <View style={styles.planFooter}>
                                                <View style={styles.planDurationContainer}>
                                                    <Text style={styles.planDurationLabel}>Duración:</Text>
                                                    <Text style={styles.planDuration}>{plan.duration} días</Text>
                                                </View>

                                                <View style={styles.planActions}>
                                                    <TouchableOpacity
                                                        style={styles.editButton}
                                                        onPress={() => handleEdit(plan)}
                                                    >
                                                        <Text style={styles.editButtonText}>✏️ Reactivar</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.deleteButton}
                                                        onPress={() => handleDelete(plan)}
                                                    >
                                                        <Text style={styles.deleteButtonText}>🗑️</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </>
                            )}
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateIcon}>📋</Text>
                            <Text style={styles.emptyStateText}>No hay planes registrados</Text>
                            <Text style={styles.emptyStateSubtext}>Crea tu primer plan de membresía</Text>
                            <TouchableOpacity
                                style={styles.emptyStateButton}
                                onPress={handleCreate}
                            >
                                <Text style={styles.emptyStateButtonText}>➕ Crear Plan</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Botón flotante para agregar (abajo izquierda) */}
            <TouchableOpacity style={[styles.fab, { left: 20, right: undefined }]} onPress={handleCreate}>
                <Text style={styles.fabText}>➕</Text>
            </TouchableOpacity>

            {/* Modal crear/editar */}
            <CreatePlanModal
                visible={showCreateModal}
                plan={editingPlan}
                onClose={handleModalClose}
            />
        </SafeAreaView>
    );
}
