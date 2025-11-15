// src/app/(auth)/login.tsx - SIN STATUSBAR (YA ESTÁ GLOBAL)
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import UserIcon from '../../assets/images/LogoPNG.png';
import { auth } from '../../services/firebaseConfig';

// ═══════════════════════════════════════════════════════════════════════════
// PANTALLA DE LOGIN CON FIREBASE AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════
  // MANEJAR LOGIN CON FIREBASE
  // ═══════════════════════════════════════════════════════════════════════
  const handleLogin = async () => {
    // Validaciones
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      // 🔐 AUTENTICAR CON FIREBASE
      console.log('🔐 Intentando login con:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      console.log('✅ Login exitoso:', userCredential.user.email);
      Alert.alert('Éxito', 'Sesión iniciada correctamente');

      // El AuthContext detectará el cambio automáticamente
      // y redirigirá al dashboard
    } catch (error: any) {
      console.error('❌ Error de login:', error.code, error.message);

      // Manejo de errores específicos de Firebase
      let errorMessage = 'Credenciales incorrectas';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'El usuario no existe';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'El usuario ha sido deshabilitado';
      }

      Alert.alert('Error de autenticación', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RECUPERAR CONTRASEÑA (POR IMPLEMENTAR)
  // ═══════════════════════════════════════════════════════════════════════
  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar contraseña',
      'Se enviará un email de recuperación a tu correo registrado',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => {
            console.log('TODO: Implementar sendPasswordResetEmail');
            Alert.alert('Info', 'Función en desarrollo');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ StatusBar ya está configurado globalmente en _layout.tsx */}

      {/* ✅ ARREGLADO: ScrollView en lugar de KeyboardAvoidingView */}
      {/* ScrollView maneja automáticamente el teclado sin bugs */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER CON LOGO */}
        <View style={styles.header}>
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

        {/* FORMULARIO */}
        <View style={styles.formContainer}>
          {/* EMAIL */}
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
              editable={!loading}
            />
          </View>

          {/* CONTRASEÑA */}
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
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Text style={styles.eyeText}>{showPassword ? '👁️‍🗨️' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTÓN LOGIN */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          {/* RECUPERAR CONTRASEÑA */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* SPACER para empujar el footer hacia abajo */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* ✅ ARREGLADO: Footer fijo en la parte inferior */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Versión 1.0.0 • Desarrollado para tu gimnasio
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  // ✅ ARREGLADO: ScrollView sin comportamientos erráticos
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
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
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  forgotPasswordText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '500',
  },
  // ✅ ARREGLADO: Spacer flexible
  spacer: {
    flex: 1,
  },
  // ✅ ARREGLADO: Footer absolutamente posicionado
  footer: {
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;