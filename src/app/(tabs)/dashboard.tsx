// src/app/(tabs)/dashboard.tsx - REFACTORIZADO CON LUCIDE + DATOS REALES
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import {
    Calendar,
    Clock,
    DollarSign,
    Plus,
    Sparkles,
    Users,
    Users as ViewAllUsers,
} from 'lucide-react';
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

// ============ MAPEO DE ICONOS LUCIDE ============
// 📌 MEJOR QUE EMOJIS: Componentes vectoriales personalizables
const ACTIVITY_ICON_MAP = {
    payment: DollarSign,
    new_client: Users,
    renewal: Users,
    expiring: Clock,
};

// ============ COMPONENTE STATS CARD ============
// 📌 CAMBIO: IconComponent ahora es un componente Lucide en lugar de emoji
const StatsCard = ({
    title,
    value,
    subtitle,
    color,
    IconComponent,
    onPress,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    IconComponent: React.FC<{ size: number; color: string; strokeWidth: number }>;
    onPress?: () => void;
}) => (
    <TouchableOpacity
        style={[styles.statsCard, { borderLeftColor: color }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.statsContent}>
            <View style={styles.statsHeader}>
                {/* ANTES: <Text style={styles.statsIcon}>{icon}</Text> */}
                {/* AHORA: Componente Lucide vectorial */}
                <View style={styles.iconContainer}>
                    <IconComponent size={24} color={color} strokeWidth={1.5} />
                </View>
                <Text style={styles.statsTitle}>{title}</Text>
            </View>
            <Text style={[styles.statsValue, { color }]}>{value}</Text>
            <Text style={styles.statsSubtitle}>{subtitle}</Text>
        </View>
    </TouchableOpacity>
);

// ============ COMPONENTE QUICK ACTION ============
// 📌 CAMBIO: IconComponent es un componente Lucide
const QuickActionButton = ({
    title,
    IconComponent,
    color,
    onPress,
}: {
    title: string;
    IconComponent: React.FC<{ size: number; color: string; strokeWidth: number }>;
    color: string;
    onPress: () => void;
}) => (
    <TouchableOpacity
        style={[styles.quickAction, { backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        {/* ANTES: <Text style={styles.quickActionIcon}>{icon}</Text> */}
        {/* AHORA: Componente Lucide en blanco */}
        <View style={styles.quickActionIconContainer}>
            <IconComponent size={32} color="white" strokeWidth={1.5} />
        </View>
        <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
);

// ============ COMPONENTE ACTIVITY ITEM ============
// 📌 CAMBIO PRINCIPAL: Busca icono en mapeo en lugar de switch
const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    // Obtener el componente de icono según el tipo
    const IconComponent = ACTIVITY_ICON_MAP[activity.type] || Clock;

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
            {/* ANTES: <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text> */}
            {/* AHORA: Componente Lucide con color primario */}
            <View style={styles.activityIconContainer}>
                <IconComponent size={20} color="#1E40AF" strokeWidth={1.5} />
            </View>
            <View style={styles.activityContent}>
                <Text style={styles.activityText}>{getActivityText(activity)}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
        </View>
    );
};

// ============ PANTALLA PRINCIPAL ============
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

            // ✅ Obtener estadísticas usando businessLogic (TUS SERVICES)
            const dashboardStats = await getDashboardStats();
            setStats(dashboardStats);

            // ✅ Obtener datos para actividades recientes (TUS SERVICES)
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

    // ✅ MANTIENE TU LÓGICA: Generar actividades recientes combinando datos
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
                const daysUntilExpiry = calculateDaysUntilExpiration(
                    client.subscription.endDate
                );
                return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
            })
            .slice(0, 3)
            .forEach((client) => {
                if (client.subscription?.endDate) {
                    const daysUntilExpiry = calculateDaysUntilExpiration(
                        client.subscription.endDate
                    );
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

    // ✅ MANTIENE TU LÓGICA: Formatear fechas
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

    // ✅ MANTIENE TU LÓGICA: Manejar acciones rápidas
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
                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* HEADER - Título y fecha */}
                {/* ═══════════════════════════════════════════════════════════════ */}
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

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* ESTADO DE CARGA O CONTENIDO */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1E40AF" />
                        <Text style={styles.loadingText}>Cargando datos...</Text>
                    </View>
                ) : (
                    <>
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* TARJETAS DE ESTADÍSTICAS */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <View style={styles.statsContainer}>
                            <StatsCard
                                title="Clientes Activos"
                                value={stats.activeClients}
                                subtitle={`de ${stats.totalClients} totales`}
                                color="#10B981"
                                IconComponent={Users}
                                onPress={() => handleQuickAction('clients')}
                            />

                            <StatsCard
                                title="Vencen esta semana"
                                value={stats.expiringThisWeek}
                                subtitle="requieren renovación"
                                color="#F59E0B"
                                IconComponent={Clock}
                                onPress={() => handleQuickAction('expiring')}
                            />

                            <StatsCard
                                title="Ingresos del mes"
                                value={`$${stats.monthlyIncome.toLocaleString('es-AR')}`}
                                subtitle="ingresos acumulados"
                                color="#1E40AF"
                                IconComponent={DollarSign}
                            />

                            <StatsCard
                                title="Nuevos clientes"
                                value={stats.newClientsThisMonth}
                                subtitle="este mes"
                                color="#8B5CF6"
                                IconComponent={Sparkles}
                            />
                        </View>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* ACCESOS RÁPIDOS */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <View style={styles.quickActionsContainer}>
                            <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
                            <View style={styles.quickActionsRow}>
                                <QuickActionButton
                                    title="Nuevo Cliente"
                                    IconComponent={Plus}
                                    color="#1E40AF"
                                    onPress={() => handleQuickAction('add_client')}
                                />
                                <QuickActionButton
                                    title="Ver Clientes"
                                    IconComponent={ViewAllUsers}
                                    color="#10B981"
                                    onPress={() => handleQuickAction('clients')}
                                />
                                <QuickActionButton
                                    title="Vencimientos"
                                    IconComponent={Calendar}
                                    color="#F59E0B"
                                    onPress={() => handleQuickAction('expiring')}
                                />
                            </View>
                        </View>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* ACTIVIDAD RECIENTE */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
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

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* ESTADO VACÍO - Sin actividad reciente */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
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