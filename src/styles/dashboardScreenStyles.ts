// src/styles/dashboardScreenStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // ═══════════════════════════════════════════════════════════════
    // CONTENEDOR PRINCIPAL - Fondo gradual moderno
    // ═══════════════════════════════════════════════════════════════
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    scrollView: {
        flex: 1,
    },

    // ═══════════════════════════════════════════════════════════════
    // HEADER - Saludo y fecha con gradiente premium
    // ═══════════════════════════════════════════════════════════════
    header: {
        backgroundColor: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#1E40AF',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    welcomeText: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.85)',
        marginBottom: 8,
        fontWeight: '500',
    },
    gymTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000000ff',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    dateText: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.75)',
        textTransform: 'capitalize',
        fontWeight: '500',
    },

    // ═══════════════════════════════════════════════════════════════
    // ESTADO DE CARGA - Contenedor visual mejorado
    // ═══════════════════════════════════════════════════════════════
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: '#4B5563',
        marginTop: 16,
        fontWeight: '600',
    },

    // ═══════════════════════════════════════════════════════════════
    // TARJETAS DE ESTADÍSTICAS - Diseño moderno con bordes TOP
    // ═══════════════════════════════════════════════════════════════
    statsContainer: {
        padding: 20,
        gap: 14,
    },
    statsCard: {
        backgroundColor: '#ffffffff',
        borderRadius: 20,
        padding: 20,
        borderTopWidth: 5,
        shadowColor: '#003cffff',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    statsContent: {
        flex: 1,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statsIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    statsTitle: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    statsValue: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 6,
        letterSpacing: -0.8,
    },
    statsSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    // ═══════════════════════════════════════════════════════════════
    // ACCESOS RÁPIDOS - Botones con gradientes y sombras
    // ═══════════════════════════════════════════════════════════════
    quickActionsContainer: {
        paddingHorizontal: 20,
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 18,
        letterSpacing: -0.3,
    },
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    quickAction: {
        flex: 1,
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        minHeight: 100,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    quickActionIcon: {
        fontSize: 28,
        marginBottom: 8,
    },
    quickActionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: -0.2,
    },

    // ═══════════════════════════════════════════════════════════════
    // ACTIVIDAD RECIENTE - Contenedor moderno con bordes
    // ═══════════════════════════════════════════════════════════════
    activitiesContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    activitiesList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderTopWidth: 5,
        borderTopColor: '#1E40AF',
        overflow: 'hidden',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1.5,
        borderBottomColor: '#F3F4F6',
    },
    activityIcon: {
        fontSize: 22,
        marginRight: 14,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '600',
        marginBottom: 4,
    },
    activityDate: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    // ═══════════════════════════════════════════════════════════════
    // ESTADO VACÍO - Diseño atractivo con borde punteado
    // ═══════════════════════════════════════════════════════════════
    emptyActivities: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 40,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#E5E7EB',
    },
    emptyActivitiesIcon: {
        fontSize: 56,
        marginBottom: 16,
        opacity: 0.6,
    },
    emptyActivitiesText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#ff0000ff',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    emptyActivitiesSubtext: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        fontWeight: '500',
    },
});