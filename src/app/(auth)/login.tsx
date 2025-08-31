    import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserIcon from '../../assets/images/LogoPNG.png';

// Importa Firebase Auth si lo tienes configurado
    // import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
    // import { app } from '../../firebaseConfig'; // Asegúrate de tener tu configuración
    // const auth = getAuth(app);
    const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
        }

        setLoading(true);
        
        try {
        // aca es donde iria la autenticación con Firebase
        console.log('Login attempt:', { email, password });
        
        // Simular delay de autenticación
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // TODO: Implementar Firebase Auth
        // const result = await signInWithEmailAndPassword(auth, email, password);
        
        } catch (error) {
        Alert.alert('Error', 'Credenciales incorrectas');
        } finally {
        setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        Alert.alert(
        'Recuperar contraseña',
        'Se enviará un email de recuperación a tu correo registrado',
        [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Enviar', onPress: () => console.log('Forgot password') }
        ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
            <View style={styles.header}>
            {/* Logo placeholder - reemplazar con el logo */}
            <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                <Image 
                source={UserIcon}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
                />
                
                </View>
                <Text style={styles.gymName}>GYM MANAGER</Text>
                <Text style={styles.subtitle}>Sistema gestor de clientes</Text>
            </View>
            </View>

            <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                style={styles.input}
                placeholder="ingresa tu email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="ingresa tu contraseña"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️'}</Text>
                </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                <ActivityIndicator color="white" size="small" />
                ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
            >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.footer}>
            <Text style={styles.footerText}>
                Versión 1.0.0 • Desarrollado para tu gimnasio
            </Text>
            </View>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
    };

    const styles = StyleSheet.create({
    container: { // Contenedor principal color azul
        flex: 1,
        backgroundColor: '#1E40AF', 
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoText: {
        fontSize: 40,
    },
    gymName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    formContainer: {
        flex: 0.6,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    eyeButton: {
        padding: 14,
    },
    eyeText: {
        fontSize: 18,
    },
    loginButton: {
        backgroundColor: '#1E40AF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#1E40AF',
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordButton: {
        alignItems: 'center',
        marginTop: 20,
    },
    forgotPasswordText: {
        color: '#1E40AF',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 5,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        textAlign: 'center',
    },
    });

    export default LoginScreen;