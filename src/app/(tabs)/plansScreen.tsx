// src/app/(tabs)/plansScreen.tsx
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

// ═══════════════════════════════════════════════════════════════════════════
// PANTALLA DE PLANES DE MEMBRESÍA
// Gestión completa de planes: crear, editar, activar, desactivar y eliminar
// ═══════════════════════════════════════════════════════════════════════════

export default function PlansScreen() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

    // ═══════════════════════════════════════════════════════════════
    // LIFECYCLE: Cargar planes cuando la pantalla se enfoca
    // ═══════════════════════════════════════════════════════════════
    useFocusEffect(
        useCallback(() => {
            loadPlans();
        }, [])
    );

    // ═══════════════════════════════════════════════════════════════
    // CARGAR PLANES: Obtiene todos los planes (activos e inactivos)
    // ═══════════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════════
    // REFRESCAR: Pull-to-refresh para actualizar lista
    // ═══════════════════════════════════════════════════════════════
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadPlans();
        setRefreshing(false);
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // EDITAR PLAN: Abre modal para editar plan existente
    // ═══════════════════════════════════════════════════════════════
    const handleEdit = (plan: MembershipPlan) => {
        setEditingPlan(plan);
        setShowCreateModal(true);
    };

    // ═══════════════════════════════════════════════════════════════
    // ELIMINAR PLAN: Borra permanentemente (solo para inactivos)
    // ═══════════════════════════════════════════════════════════════
    const handleDelete = async (plan: MembershipPlan) => {
        Alert.alert(
            "Eliminar plan definitivamente",
            `¿Seguro que querés eliminar "${plan.planName}" para siempre?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
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

    // ═══════════════════════════════════════════════════════════════
    // CREAR NUEVO: Abre modal sin plan seleccionado (create mode)
    // ═══════════════════════════════════════════════════════════════
    const handleCreate = () => {
        setEditingPlan(null);
        setShowCreateModal(true);
    };

    // ═══════════════════════════════════════════════════════════════
    // CERRAR MODAL: Cierra modal y recarga lista de planes
    // ═══════════════════════════════════════════════════════════════
    const handleModalClose = () => {
        setShowCreateModal(false);
        setEditingPlan(null);
        loadPlans();
    };

    // ═══════════════════════════════════════════════════════════════
    // SEPARAR PLANES: Divide activos e inactivos para mostrar
    // ═══════════════════════════════════════════════════════════════
    const activePlans = plans.filter((p) => p.isActive);
    const inactivePlans = plans.filter((p) => !p.isActive);

    return (
        <SafeAreaView style={styles.container}>
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* HEADER - Título y resumen */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Planes de Membresía</Text>
                    <Text style={styles.headerSubtitle}>
                        {activePlans.length} planes activos • {inactivePlans.length} inactivos
                    </Text>
                </View>
            </View>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CONTENIDO PRINCIPAL */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.content}>
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* ESTADO: CARGANDO */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1E40AF" />
                            <Text style={styles.loadingText}>Cargando planes...</Text>
                        </View>
                    ) : plans.length > 0 ? (
                        <>
                            {/* ═══════════════════════════════════════════════════════════════ */}
                            {/* SECCIÓN: PLANES ACTIVOS */}
                            {/* ═══════════════════════════════════════════════════════════════ */}
                            {activePlans.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>✅ Planes Activos</Text>
                                    {activePlans.map((plan) => (
                                        <View key={plan.id} style={styles.planCard}>
                                            {/* Header del plan: Nombre y Precio */}
                                            <View style={styles.planHeader}>
                                                <View style={styles.planHeaderLeft}>
                                                    <Text style={styles.planName}>
                                                        {plan.planName}
                                                    </Text>
                                                    <View style={styles.activeBadge}>
                                                        <Text style={styles.activeBadgeText}>
                                                            ACTIVO
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.planPrice}>
                                                    ${plan.price}
                                                </Text>
                                            </View>

                                            {/* Descripción del plan */}
                                            <Text style={styles.planDescription}>
                                                {plan.description}
                                            </Text>

                                            {/* Footer: Duración y botones */}
                                            <View style={styles.planFooter}>
                                                <View style={styles.planDurationContainer}>
                                                    <Text style={styles.planDurationLabel}>
                                                        Duración:
                                                    </Text>
                                                    <Text style={styles.planDuration}>
                                                        {plan.duration} días
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={styles.editButton}
                                                    onPress={() => handleEdit(plan)}
                                                >
                                                    <Text style={styles.editButtonText}>
                                                        ✏️ Editar
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </>
                            )}

                            {/* ═══════════════════════════════════════════════════════════════ */}
                            {/* SECCIÓN: PLANES INACTIVOS */}
                            {/* ═══════════════════════════════════════════════════════════════ */}
                            {inactivePlans.length > 0 && (
                                <>
                                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                                        ❌ Planes Inactivos
                                    </Text>
                                    {inactivePlans.map((plan) => (
                                        <View
                                            key={plan.id}
                                            style={[styles.planCard, styles.planCardInactive]}
                                        >
                                            {/* Header del plan: Nombre y Precio */}
                                            <View style={styles.planHeader}>
                                                <View style={styles.planHeaderLeft}>
                                                    <Text style={styles.planName}>
                                                        {plan.planName}
                                                    </Text>
                                                    <View style={styles.inactiveBadge}>
                                                        <Text style={styles.inactiveBadgeText}>
                                                            INACTIVO
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.planPrice}>
                                                    ${plan.price}
                                                </Text>
                                            </View>

                                            {/* Descripción del plan */}
                                            <Text style={styles.planDescription}>
                                                {plan.description}
                                            </Text>

                                            {/* Footer: Duración y botones */}
                                            <View style={styles.planFooter}>
                                                <View style={styles.planDurationContainer}>
                                                    <Text style={styles.planDurationLabel}>
                                                        Duración:
                                                    </Text>
                                                    <Text style={styles.planDuration}>
                                                        {plan.duration} días
                                                    </Text>
                                                </View>

                                                {/* Botones: Reactivar y Eliminar */}
                                                <View style={styles.planActions}>
                                                    <TouchableOpacity
                                                        style={styles.editButton}
                                                        onPress={() => handleEdit(plan)}
                                                    >
                                                        <Text style={styles.editButtonText}>
                                                            ✏️ Reactivar
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.deleteButton}
                                                        onPress={() => handleDelete(plan)}
                                                    >
                                                        <Text style={styles.deleteButtonText}>
                                                            🗑️
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </>
                            )}
                        </>
                    ) : (
                        /* ═══════════════════════════════════════════════════════════════ */
                        /* ESTADO: VACÍO - Sin planes registrados */
                        /* ═══════════════════════════════════════════════════════════════ */
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateIcon}>📋</Text>
                            <Text style={styles.emptyStateText}>
                                No hay planes registrados
                            </Text>
                            <Text style={styles.emptyStateSubtext}>
                                Crea tu primer plan de membresía
                            </Text>
                            <TouchableOpacity
                                style={styles.emptyStateButton}
                                onPress={handleCreate}
                            >
                                <Text style={styles.emptyStateButtonText}>
                                    ➕ Crear Plan
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* BOTÓN FLOTANTE - Crear nuevo plan */}
            {/* Posicionado en la zona segura (bottom + tab bar offset) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TouchableOpacity
                style={styles.fab}
                onPress={handleCreate}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>➕</Text>
            </TouchableOpacity>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL - Crear/Editar plan */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <CreatePlanModal
                visible={showCreateModal}
                plan={editingPlan}
                onClose={handleModalClose}
            />
        </SafeAreaView>
    );
}