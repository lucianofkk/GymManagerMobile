// src/app/(tabs)/about.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LogoPNG from '../../assets/images/LogoPNG.png';
import { styles } from '../../styles/aboutScreenStyles';

export default function AboutScreen() {
    // Estado para manejar el loading del logout
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const openLink = (url: string) => Linking.openURL(url);

    const handleGitHubPress = () => {
        openLink('https://github.com/lucianofkk/GymManagerMobile');
    };

    // Función para cerrar sesión
    const handleLogout = async () => {
        // Mostrar confirmación antes de cerrar sesión
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Logout cancelado'),
                    style: 'cancel',
                },
                {
                    text: 'Cerrar Sesión',
                    onPress: async () => {
                        try {
                            setIsLoggingOut(true);
                            
                            // TODO: Implementar logout con Firebase
                            // const auth = getAuth();
                            // await signOut(auth);
                            
                            // Simular delay de logout
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            console.log('✅ Sesión cerrada correctamente');
                            
                            // Redirigir al login
                            router.replace('/(auth)/login');
                        } catch (error) {
                            console.error('❌ Error al cerrar sesión:', error);
                            Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta de nuevo.');
                        } finally {
                            setIsLoggingOut(false);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header con logo - SIN ANIMACIONES */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Image 
                            source={LogoPNG} 
                            style={styles.logo} 
                            resizeMode="contain" 
                        />
                        <View style={styles.logoGlow} />
                    </View>
                </View>

                {/* Título principal - SIN ANIMACIONES */}
                <View>
                    <Text style={styles.title}>Gym Manager</Text>
                    <Text style={styles.subtitle}>
                        Solución integral para gestión de gimnasios
                    </Text>
                    
                    {/* Badge de versión */}
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>v1.0.0</Text>
                    </View>
                </View>

                {/* Tarjeta de información - SIN ANIMACIONES */}
                <View style={styles.infoCard}>
                    <View style={styles.infoHeader}>
                        <Ionicons name="information-circle" size={24} color="#1E40AF" />
                        <Text style={styles.infoTitle}>Información de la App</Text>
                    </View>
                    
                    <View style={styles.infoContent}>
                        <View style={styles.infoRow}>
                            <Ionicons name="person" size={18} color="#6B7280" />
                            <Text style={styles.infoLabel}>Desarrollador:</Text>
                            <Text style={styles.infoValue}>FRIAS-KLEIN, Luciano</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar" size={18} color="#6B7280" />
                            <Text style={styles.infoLabel}>Año:</Text>
                            <Text style={styles.infoValue}>2025</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="shield-checkmark" size={18} color="#6B7280" />
                            <Text style={styles.infoLabel}>Licencia:</Text>
                            <Text style={styles.infoValue}>Todos los derechos reservados</Text>
                        </View>
                    </View>
                </View>

                {/* Botón GitHub - SIN ANIMACIONES */}
                <TouchableOpacity
                    style={styles.githubButton}
                    onPress={handleGitHubPress}
                    activeOpacity={0.8}
                >
                    <View style={styles.githubButtonContent}>
                        <Ionicons name="logo-github" size={24} color="#FFFFFF" />
                        <Text style={styles.githubButtonText}>Ver Código en GitHub</Text>
                    </View>
                    <Ionicons name="open-outline" size={18} color="#FFFFFF" style={styles.externalIcon} />
                </TouchableOpacity>

                {/* Descripción en tarjeta - SIN ANIMACIONES */}
                <View style={styles.descriptionCard}>
                    <Text style={styles.descriptionTitle}>Acerca de la Aplicación</Text>
                    <Text style={styles.descriptionText}>
                        Gym Manager es una solución completa desarrollada con tecnologías modernas 
                        para optimizar la gestión de gimnasios. Permite administrar socios, controlar 
                        pagos, gestionar asistencia y enviar notificaciones de manera eficiente.
                    </Text>
                    
                    <View style={styles.techStack}>
                        <View style={styles.techPill}>
                            <Text style={styles.techText}>React Native</Text>
                        </View>
                        <View style={styles.techPill}>
                            <Text style={styles.techText}>Firebase</Text>
                        </View>
                        <View style={styles.techPill}>
                            <Text style={styles.techText}>TypeScript</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Desarrollado con ❤️ para la comunidad fitness
                    </Text>
                </View>

                {/* ========== BOTÓN DE CERRAR SESIÓN ========== */}
                {/* Nuevo botón al final - Estilo rojo para indicar acción peligrosa */}
                <TouchableOpacity
                    style={[
                        styles.logoutButton,
                        isLoggingOut && styles.logoutButtonDisabled
                    ]}
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                    activeOpacity={0.8}
                >
                    <Ionicons 
                        name="log-out-outline" 
                        size={20} 
                        color="#FFFFFF" 
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.logoutButtonText}>
                        {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                    </Text>
                </TouchableOpacity>

                {/* Espacio adicional al final para scroll */}
                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
}