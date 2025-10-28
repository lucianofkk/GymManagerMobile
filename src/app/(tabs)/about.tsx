import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Easing,
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
    const scaleValue = new Animated.Value(0);
    const fadeValue = new Animated.Value(0);

    React.useEffect(() => {
        // Animación de entrada
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 800,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }),
            Animated.timing(fadeValue, {
                toValue: 1,
                duration: 600,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const openLink = (url: string) => Linking.openURL(url);

    const handleGitHubPress = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => openLink('https://github.com/lucianofkk/GymManagerMobile'));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header con logo animado */}
                <Animated.View 
                    style={[
                        styles.avatarContainer,
                        {
                            opacity: fadeValue,
                            transform: [{ scale: scaleValue }]
                        }
                    ]}
                >
                    <View style={styles.avatar}>
                        <Image 
                            source={LogoPNG} 
                            style={styles.logo} 
                            resizeMode="contain" 
                        />
                        <View style={styles.logoGlow} />
                    </View>
                </Animated.View>

                {/* Título principal */}
                <Animated.View style={{ opacity: fadeValue }}>
                    <Text style={styles.title}>Gym Manager</Text>
                    <Text style={styles.subtitle}>
                        Solución integral para gestión de gimnasios
                    </Text>
                    
                    {/* Badge de versión */}
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>v1.0.0</Text>
                    </View>
                </Animated.View>

                {/* Tarjeta de información */}
                <Animated.View 
                    style={[
                        styles.infoCard,
                        { opacity: fadeValue }
                    ]}
                >
                    <View style={styles.infoHeader}>
                        <Ionicons name="information-circle" size={24} color="#007AFF" />
                        <Text style={styles.infoTitle}>Información de la App</Text>
                    </View>
                    
                    <View style={styles.infoContent}>
                        <View style={styles.infoRow}>
                            <Ionicons name="person" size={18} color="#666" />
                            <Text style={styles.infoLabel}>Desarrollador:</Text>
                            <Text style={styles.infoValue}>FRIAS-KLEIN, Luciano</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar" size={18} color="#666" />
                            <Text style={styles.infoLabel}>Año:</Text>
                            <Text style={styles.infoValue}>2025</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="shield-checkmark" size={18} color="#666" />
                            <Text style={styles.infoLabel}>Licencia:</Text>
                            <Text style={styles.infoValue}>Todos los derechos reservados</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Botón GitHub mejorado */}
                <Animated.View style={{ opacity: fadeValue }}>
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
                </Animated.View>

                {/* Descripción en tarjeta */}
                <Animated.View 
                    style={[
                        styles.descriptionCard,
                        { opacity: fadeValue }
                    ]}
                >
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
                </Animated.View>

                {/* Footer */}
                <Animated.View 
                    style={[
                        styles.footer,
                        { opacity: fadeValue }
                    ]}
                >
                    <Text style={styles.footerText}>
                        Desarrollado con ❤️ para la comunidad fitness
                    </Text>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}