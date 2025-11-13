// src/app/(tabs)/dashboard.tsx - CON IONICONS

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    calculateDaysUntilExpiration,
    getClientsWithSubscription,
    getDashboardStats,
} from '../../services/businessLogic';
import { getPayments } from '../../services/paymentService';
import { styles } from '../../styles/dashboardScreenStyles';
import { ClientWithSubscription, DashboardStats, RecentActivity } from '../../types/type';

const { width } = Dimensions.get('window');

// ============ MAPEO DE ICONOS IONICONS ============
// 📌 Ionicons disponibles en Expo
const ACTIVITY_ICON_MAP = {
    payment: 'card',
    new_client: 'person-add',
    renewal: 'refresh',
    expiring: 'alarm',
};

// ============ COMPONENTE STATS CARD ============
// 📌 CAMBIO: Ahora usa Ionicons en lugar de componentes
const StatsCard = ({
    title,
    value,
    subtitle,
    color,
    iconName,
    onPress,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
}) => (
    <TouchableOpacity
        style={[styles.statsCard, { borderLeftColor: color }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.statsContent}>
            <View style={styles.statsHeader}>
                {/* 📌 CAMBIO: Usar Ionicons directamente */}
                <View style={styles.iconContainer}>
                    <Ionicons name={iconName} size={24} color={color} />
                </View>
                <Text style={styles.statsTitle}>{title}</Text>
            </View>
            <Text style={[styles.statsValue, { color }]}>{value}</Text>
            <Text style={styles.statsSubtitle}>{subtitle}</Text>
        </View>
    </TouchableOpacity>
);

// ============ COMPONENTE QUICK ACTION ============
// 📌 CAMBIO: Ahora usa Ionicons
const QuickActionButton = ({
    title,
    iconName,
    color,
    onPress,
}: {
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
}) => (
    <TouchableOpacity
        style={[styles.quickAction, { backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        {/* 📌 CAMBIO: Usar Ionicons directamente */}
        <Ionicons name={iconName} size={32} color="white" />
        <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
);

// ============ COMPONENTE ACTIVITY ITEM ============
// 📌 CAMBIO PRINCIPAL: Busca icono en mapeo
const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    // Obtener el nombre del icono según el tipo
    const iconName = ACTIVITY_ICON_MAP[activity.type] || 'alert-circle';

    const getActivityText = (activity: RecentActivity) => {
        switch (activity.type) {
            case 'payment':
                return `${activity.clientName} pagó $${activity.amount?.toLocaleString('es-AR')}`;
            case 'new_client':
                return `${activity.clientName} se registró`;
            case 'renewal':
                return `${activity.clientName} renovó membresía`;
            case 'expiring':
                return `${activity.clientName} vence pronto`;
            default:
                return activity.clientName;
        }
    };

    return (
        <View style={styles.activityItem}>
            {/* 📌 CAMBIO: Usar Ionicons directamente */}
            <View style={styles.activityIconContainer}>
                <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={20} color="#1E40AF" />
            </View>
            <View style={styles.activityContent}>
                <Text style={styles.activityText}>{getActivityText(activity)}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
        </View>
    );
};

// ============ DASHBOARD SCREEN ============
const DashboardScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalClients: 0,
        activeClients: 0,
        expiringThisWeek: 0,
        monthlyIncome: 0,
        newClientsThisMonth: 0,
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

    // Cargar datos cuando la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            loadDashboardData();
        }, [])
    );

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // ✅ Obtener estadísticas
            const dashboardStats = await getDashboardStats();
            setStats(dashboardStats);

            // ✅ Obtener datos para actividades recientes
            const clientsWithSub = await getClientsWithSubscription();
            const payments = await getPayments();

            const activities = generateRecentActivities(clientsWithSub, payments);
            setRecentActivities(activities);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Generar actividades recientes
    const generateRecentActivities = (
        clients: ClientWithSubscription[],
        payments: any[]
    ): RecentActivity[] => {
        const activities: RecentActivity[] = [];

        // Pagos recientes (últimos 3)
        payments
            .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
            .slice(0, 3)
            .forEach((payment) => {
                const client = clients.find((c) => c.id === payment.clientId);
                if (client) {
                    activities.push({
                        id: `payment-${payment.id}`,
                        type: 'payment',
                        clientName: `${client.firstName} ${client.lastName}`,
                        amount: payment.amount,
                        date: formatDate(new Date(payment.paymentDate)),
                        clientId: client.id,
                    });
                }
            });

        // Suscripciones por vencer (máximo 3)
        clients
            .filter((client) => {
                if (!client.subscription?.endDate) return false;
                const daysUntilExpiry = calculateDaysUntilExpiration(client.subscription.endDate);
                return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
            })
            .slice(0, 3)
            .forEach((client) => {
                if (client.subscription?.endDate) {
                    const daysUntilExpiry = calculateDaysUntilExpiration(client.subscription.endDate);
                    activities.push({
                        id: `expiring-${client.id}`,
                        type: 'expiring',
                        clientName: `${client.firstName} ${client.lastName}`,
                        date: `Vence en ${daysUntilExpiry} días`,
                        clientId: client.id,
                    });
                }
            });

        return activities.slice(0, 5);
    };

    // ✅ Formatear fechas
    const formatDate = (date: Date): string => {
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                return 'Hoy';
            } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Ayer';
            } else {
                const diffDays = Math.floor(
                    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
                );
                if (diffDays === 1) return 'Hace 1 día';
                if (diffDays < 7) return `Hace ${diffDays} días`;
                return date.toLocaleDateString('es-AR', {
                    month: 'short',
                    day: 'numeric',
                });
            }
        } catch {
            return '';
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    }, []);

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'clients':
                router.push('/(clients)/membersList');
                break;
            case 'add_client':
                router.push('/(clients)/newMember');
                break;
            case 'expiring':
              router.push('/(clients)/membersList');
                break;
            default:
                console.log(`Action: ${action}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>¡Buen día!</Text>
                    <Text style={styles.gymTitle}>Panel de Control</Text>
                    <Text style={styles.dateText}>
                        {new Date().toLocaleDateString('es-AR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </View>

                {/* ESTADO DE CARGA */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1E40AF" />
                        <Text style={styles.loadingText}>Cargando datos...</Text>
                    </View>
                ) : (
                    <>
                        {/* TARJETAS DE ESTADÍSTICAS */}
                        <View style={styles.statsContainer}>
                            <StatsCard
                                title="Clientes Activos"
                                value={stats.activeClients}
                                subtitle={`de ${stats.totalClients} totales`}
                                color="#10B981"
                                iconName="people"
                                onPress={() => handleQuickAction('clients')}
                            />

                            <StatsCard
                                title="Vencen esta semana"
                                value={stats.expiringThisWeek}
                                subtitle="requieren renovación"
                                color="#F59E0B"
                                iconName="alarm"
                                onPress={() => handleQuickAction('expiring')}
                            />

                            <StatsCard
                                title="Ingresos del mes"
                                value={`$${stats.monthlyIncome.toLocaleString('es-AR')}`}
                                subtitle="ingresos acumulados"
                                color="#1E40AF"
                                iconName="card"
                            />

                            <StatsCard
                                title="Nuevos clientes"
                                value={stats.newClientsThisMonth}
                                subtitle="este mes"
                                color="#8B5CF6"
                                iconName="sparkles"
                            />
                        </View>

                        {/* ACCESOS RÁPIDOS */}
                        <View style={styles.quickActionsContainer}>
                            <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
                            <View style={styles.quickActionsRow}>
                                <QuickActionButton
                                    title="Nuevo Cliente"
                                    iconName="person-add"
                                    color="#1E40AF"
                                    onPress={() => handleQuickAction('add_client')}
                                />
                                <QuickActionButton
                                    title="Ver Clientes"
                                    iconName="people"
                                    color="#10B981"
                                    onPress={() => handleQuickAction('clients')}
                                />
                                <QuickActionButton
                                    title="Vencimientos"
                                    iconName="calendar"
                                    color="#F59E0B"
                                    onPress={() => handleQuickAction('expiring')}
                                />
                            </View>
                        </View>

                        {/* ACTIVIDAD RECIENTE */}
                        {recentActivities.length > 0 && (
                            <View style={styles.activitiesContainer}>
                                <Text style={styles.sectionTitle}>Actividad Reciente</Text>
                                <View style={styles.activitiesList}>
                                    {recentActivities.map((activity) => (
                                        <ActivityItem key={activity.id} activity={activity} />
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* ESTADO VACÍO */}
                        {recentActivities.length === 0 && !loading && (
                            <View style={styles.emptyActivities}>
                                <Text style={styles.emptyActivitiesIcon}>📭</Text>
                                <Text style={styles.emptyActivitiesText}>
                                    No hay actividad reciente
                                </Text>
                                <Text style={styles.emptyActivitiesSubtext}>
                                    Agrega clientes y registra pagos para ver actividad
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default DashboardScreen;