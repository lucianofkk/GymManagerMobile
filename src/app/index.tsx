    // app/index.tsx
    import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

    export default function IndexScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Gym Manager</Text>
        <Text style={styles.subtitle}>Bienvenido</Text>
        
        {/* Sección de Clientes */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Clientes</Text>
            <Link href="/(clients)/membersList" style={styles.button}>
            <Text style={styles.buttonText}>Ver Lista de Miembros</Text>
            </Link>
            
            <Link href="/(clients)/newMember" style={styles.button}>
            <Text style={styles.buttonText}>Agregar Nuevo Miembro</Text>
            </Link>
        </View>

        {/* Sección Principal */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Principal</Text>
            <Link href="/(tabs)/dashboard" style={styles.button}>
            <Text style={styles.buttonText}>Dashboard</Text>
            </Link>
            
            <Link href="/(tabs)/about" style={styles.button}>
            <Text style={styles.buttonText}>Acerca de</Text>
            </Link>

            <Link href="/(tabs)/plansScreen" style={styles.button}>
            <Text style={styles.buttonText}>Planes</Text>
            </Link>
        </View>

        {/* Sección de Autenticación */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔐 Autenticación</Text>
            <Link href="/(auth)/login" style={[styles.button, styles.authButton]}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Link>
        </View>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#6B7280',
        marginBottom: 40,
    },
    section: {
        width: '100%',
        marginBottom: 30,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#1E3A8A',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 12,
        width: '80%',
        alignItems: 'center',
    },
    authButton: {
        backgroundColor: '#059669', // Verde para login
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    });