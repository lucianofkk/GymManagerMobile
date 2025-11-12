// src/styles/aboutScreenStyles.ts
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6eff9ff', // Fondo blanco/gris claro de la app
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        alignItems: 'center',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1E40AF', // Sombra azul (color primario)
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        position: 'relative',
    },
    logo: {
        width: 80,
        height: 80,
    },
    logoGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1E40AF', // Color azul primario
        opacity: 0.08,
        zIndex: -1,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    versionBadge: {
        backgroundColor: '#1E40AF', // Azul primario
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'center',
    },
    versionText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        marginVertical: 20,
        width: width - 48,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginLeft: 8,
    },
    infoContent: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        minWidth: 90,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        flex: 1,
    },
    githubButton: {
        backgroundColor: '#1A1A1A', // Negro para contrastar
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginVertical: 16,
        width: width - 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    githubButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    githubButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    externalIcon: {
        opacity: 0.8,
    },
    descriptionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        marginVertical: 16,
        width: width - 48,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    descriptionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6B7280',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    techStack: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    techPill: {
        backgroundColor: '#EFF6FF', // Azul muy claro
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE', // Azul medio
    },
    techText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E40AF', // Azul primario
    },
    footer: {
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        width: '100%',
    },
    footerText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
        textAlign: 'center',
    },

    // ========== ESTILOS DEL BOTÓN LOGOUT ========== 
    // Nuevos estilos para el botón de cerrar sesión
    logoutButton: {
        backgroundColor: '#EF4444', // Rojo para indicar acción peligrosa
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginTop: 24,
        marginBottom: 12,
        width: width - 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EF4444',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    logoutButtonDisabled: {
        backgroundColor: '#FECACA', // Rojo claro cuando está deshabilitado
        opacity: 0.7,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});