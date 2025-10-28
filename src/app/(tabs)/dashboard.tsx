// src/app/(tabs)/dashboard.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

    const { width } = Dimensions.get('window');

    // Interfaces TypeScript
    interface DashboardStats {
    totalClients: number;
    activeClients: number;
    expiringThisWeek: number;
    monthlyIncome: number;
    newClientsThisMonth: number;
    }

    interface RecentActivity {
    id: string;
    type: 'payment' | 'new_client' | 'renewal';
    clientName: string;
    amount?: number;
    date: string;
    }

    // Componente StatsCard
    const StatsCard = ({ 
    title, 
    value, 
    subtitle, 
    color, 
    icon, 
    onPress 
    }: {
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    icon: string;
    onPress?: () => void;
    }) => (
    <TouchableOpacity style={[styles.statsCard, { borderLeftColor: color }]} onPress={onPress}>
        <View style={styles.statsContent}>
        <View style={styles.statsHeader}>
            <Text style={styles.statsIcon}>{icon}</Text>
            <Text style={styles.statsTitle}>{title}</Text>
        </View>
        <Text style={[styles.statsValue, { color }]}>{value}</Text>
        <Text style={styles.statsSubtitle}>{subtitle}</Text>
        </View>
    </TouchableOpacity>
    );

    // Componente QuickAction
    const QuickActionButton = ({ 
    title, 
    icon, 
    color, 
    onPress 
    }: {
    title: string;
    icon: string;
    color: string;
    onPress: () => void;
    }) => (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor: color }]} onPress={onPress}>
        <Text style={styles.quickActionIcon}>{icon}</Text>
        <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
    );

    // Componente ActivityItem
    const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
        case 'payment': return '💰';
        case 'new_client': return '👤';
        case 'renewal': return '🔄';
        default: return '📝';
        }
    };

    const getActivityText = (activity: RecentActivity) => {
        switch (activity.type) {
        case 'payment':
            return `${activity.clientName} pagó $${activity.amount?.toLocaleString()}`;
        case 'new_client':
            return `${activity.clientName} se registró`;
        case 'renewal':
            return `${activity.clientName} renovó membresía`;
        default:
            return activity.clientName;
        }
    };

    return (
        <View style={styles.activityItem}>
        <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
        <View style={styles.activityContent}>
            <Text style={styles.activityText}>{getActivityText(activity)}</Text>
            <Text style={styles.activityDate}>{activity.date}</Text>
        </View>
        </View>
    );
    };

    const DashboardScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<DashboardStats>({
        totalClients: 0,
        activeClients: 0,
        expiringThisWeek: 0,
        monthlyIncome: 0,
        newClientsThisMonth: 0,
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

    // Simular carga de datos (reemplazar con datos reales)
    const loadDashboardData = async () => {
        // TODO: Conectar con Firebase
        setStats({
        totalClients: 7,
        activeClients: 5,
        expiringThisWeek: 2,
        monthlyIncome: 150000,
        newClientsThisMonth: 2,
        });

        setRecentActivities([
        {
            id: '1',
            type: 'payment',
            clientName: 'María González',
            amount: 8500,
            date: 'Hace 2 horas'
        },
        {
            id: '2',
            type: 'new_client',
            clientName: 'Carlos Rodríguez',
            date: 'Hace 4 horas'
        },
        {
            id: '3',
            type: 'renewal',
            clientName: 'Ana López',
            date: 'Ayer'
        },
        {
            id: '4',
            type: 'payment',
            clientName: 'Juan Pérez',
            amount: 8500,
            date: 'Hace 2 días'
        }
        ]);
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadDashboardData().then(() => setRefreshing(false));
    }, []);

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'clients':
                router.push('/(clients)/membersList');
                break;
            case 'add_client':
                router.push('/(clients)/newMember');
                break;
            case 'payments':
                // router.push('/payments'); // Crear esta pantalla después
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
            {/* Header */}
            <View style={styles.header}>
            <Text style={styles.welcomeText}>¡Buen día! 👋</Text>
            <Text style={styles.gymTitle}>Panel de Control</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('es-AR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</Text>
            </View>

            {/* stats cards */}
            <View style={styles.statsContainer}>
            <StatsCard
                title="Clientes Activos"
                value={stats.activeClients}
                subtitle={`de ${stats.totalClients} totales`}
                color="#10B981"
                icon="👥"
                onPress={() => handleQuickAction('clients')}
            />
            
            <StatsCard
                title="Vencen esta semana"
                value={stats.expiringThisWeek}
                subtitle="requieren renovación"
                color="#F59E0B"
                icon="⏰"
                onPress={() => handleQuickAction('expiring')}
            />
            
            <StatsCard
                title="Ingresos del mes"
                value={`$${stats.monthlyIncome.toLocaleString()}`}
                subtitle="ingresos acumulados"
                color="#1E40AF"
                icon="💰"
                onPress={() => handleQuickAction('payments')}
            />
            
            <StatsCard
                title="Nuevos clientes"
                value={stats.newClientsThisMonth}
                subtitle="este mes"
                color="#8B5CF6"
                icon="✨"
                onPress={() => handleQuickAction('new_clients')}
            />
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
            <View style={styles.quickActionsRow}>
                <QuickActionButton
                title="Nuevo Cliente"
                icon="➕"
                color="#1E40AF"
                onPress={() => handleQuickAction('add_client')}
                />
                <QuickActionButton
                title="Cobrar Cuota"
                icon="💳"
                color="#10B981"
                onPress={() => handleQuickAction('collect_payment')}
                />
                <QuickActionButton
                title="Ver Vencimientos"
                icon="📅"
                color="#F59E0B"
                onPress={() => handleQuickAction('due_dates')}
                />
            </View>
            </View>

            {/* Recent Activities */}
            <View style={styles.activitiesContainer}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            <View style={styles.activitiesList}>
                {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
                ))}
            </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 18,
        color: '#6B7280',
        marginBottom: 4,
    },
    gymTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#9CA3AF',
        textTransform: 'capitalize',
    },
    statsContainer: {
        padding: 20,
        gap: 16,
    },
    statsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statsContent: {
        flex: 1,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statsIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    statsTitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    statsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statsSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    quickActionsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    quickAction: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        minHeight: 80,
        justifyContent: 'center',
    },
    quickActionIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    quickActionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    activitiesContainer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    activitiesList: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 4,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    activityIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
        marginBottom: 2,
    },
    activityDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    });

export default DashboardScreen;