    import React from 'react';
import {
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
    const openLink = (url: string) => Linking.openURL(url);

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
            {/* avatar / logo */}
            <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
                <Image source={LogoPNG} style={styles.logo} resizeMode="contain" /></View>
            </View>

            {/* titulo */}
            <Text style={styles.title}>Gym Manager</Text>
            <Text style={styles.subtitle}>Gestión de clientes para gimnasios</Text>

            {/* info */}
            <View style={styles.infoBox}>
            <Text style={styles.infoText}>Versión: 1.0.0</Text>
            <Text style={styles.infoText}>Desarrollado por: Tu Equipo</Text>
            <Text style={styles.infoText}>© 2025 - Todos los derechos reservados</Text>
            </View>

            {/* boton GitHub */}
            <TouchableOpacity
            style={styles.button}
            onPress={() => openLink('https://github.com/lucianofkk/GymManagerMobile')}
            >
            <Text style={styles.buttonText}>Ver en GitHub</Text>
            </TouchableOpacity>

            {/* descripcion */}
            <Text style={styles.description}>
            Esta aplicación fue creada para simplificar la gestión de socios,
            pagos y asistencia en gimnasios. Usa tecnologías modernas como
            React Native y Firebase.
            </Text>
        </ScrollView>
        </SafeAreaView>
    );
    }